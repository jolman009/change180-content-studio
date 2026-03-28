import { corsHeaders } from "../_shared/cors.ts";
import { isUUID, stripHtml, sanitizeHashtags, enforceCharLimit } from "../_shared/validation.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const LINKEDIN_POSTS_URL = "https://api.linkedin.com/rest/posts";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

type Credential = {
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  platform_user_id: string;
};

/**
 * Attempt to refresh a LinkedIn access token using the stored refresh_token.
 * Returns the new access token on success, or null if refresh is not possible.
 */
async function refreshLinkedInToken(
  credential: Credential,
  userId: string,
  supabaseAdmin: SupabaseClient,
): Promise<string | null> {
  if (!credential.refresh_token) return null;

  const clientId = Deno.env.get("LINKEDIN_CLIENT_ID");
  const clientSecret = Deno.env.get("LINKEDIN_CLIENT_SECRET");
  if (!clientId || !clientSecret) return null;

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: credential.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) return null;

  const newAccessToken = data.access_token as string;
  const newRefreshToken = (data.refresh_token as string) || credential.refresh_token;
  const expiresIn = (data.expires_in as number) || 5184000;
  const newExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  await supabaseAdmin
    .from("platform_credentials")
    .update({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      token_expires_at: newExpiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("platform", "LinkedIn");

  return newAccessToken;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed." }, 405);
  }

  // Verify JWT
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ message: "Missing authorization token." }, 401);
  }

  const jwt = authHeader.replace("Bearer ", "");

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(jwt);

    if (authError || !user) {
      return jsonResponse({ message: "Invalid or expired token." }, 401);
    }

    const { postId } = await request.json();

    if (!isUUID(postId)) {
      return jsonResponse({ message: "Missing or invalid postId (UUID required)." }, 400);
    }

    // Get LinkedIn credential
    const { data: credential, error: credError } = await supabaseAdmin
      .from("platform_credentials")
      .select("access_token, refresh_token, token_expires_at, platform_user_id")
      .eq("user_id", user.id)
      .eq("platform", "LinkedIn")
      .single();

    if (credError || !credential) {
      return jsonResponse(
        { message: "LinkedIn account not connected. Please connect your account first." },
        400,
      );
    }

    // Check token expiry — attempt silent refresh before rejecting
    let activeAccessToken = credential.access_token;
    if (
      credential.token_expires_at &&
      new Date(credential.token_expires_at) < new Date()
    ) {
      const refreshed = await refreshLinkedInToken(credential, user.id, supabaseAdmin);
      if (!refreshed) {
        return jsonResponse(
          { message: "LinkedIn token has expired and could not be refreshed. Please reconnect your account." },
          401,
        );
      }
      activeAccessToken = refreshed;
    }

    // Get content post
    const { data: post, error: postError } = await supabaseAdmin
      .from("content_posts")
      .select("hook, body, cta, hashtags, media_url")
      .eq("id", postId)
      .eq("user_id", user.id)
      .single();

    if (postError || !post) {
      return jsonResponse({ message: "Content post not found." }, 404);
    }

    // Compose LinkedIn commentary (sanitized)
    const parts = [post.hook, post.body, post.cta]
      .filter(Boolean)
      .map((t: string) => stripHtml(t));
    const hashtags = sanitizeHashtags(post.hashtags).join(" ");
    if (hashtags) {
      parts.push(hashtags);
    }
    const commentary = enforceCharLimit(parts.join("\n\n"), "LinkedIn");

    // Publish to LinkedIn (organization page)
    const orgId = Deno.env.get("LINKEDIN_ORG_ID");
    const author = orgId
      ? `urn:li:organization:${orgId}`
      : `urn:li:person:${credential.platform_user_id}`;

    // Build post payload — include image article if media is attached
    const postPayload: Record<string, unknown> = {
      author,
      commentary,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
    };

    if (post.media_url) {
      postPayload.content = {
        article: {
          source: post.media_url,
          title: stripHtml(post.hook || ""),
        },
      };
    }

    const linkedInResponse = await fetch(LINKEDIN_POSTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${activeAccessToken}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202601",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postPayload),
    });

    if (!linkedInResponse.ok) {
      const errorBody = await linkedInResponse.json().catch(() => ({}));
      const errorMessage =
        errorBody.message || errorBody.error || "LinkedIn API request failed.";

      // Update post with error
      await supabaseAdmin
        .from("content_posts")
        .update({
          publish_error: errorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId)
        .eq("user_id", user.id);

      return jsonResponse({ message: errorMessage }, 502);
    }

    const platformPostId =
      linkedInResponse.headers.get("x-restli-id") || null;
    const publishedAt = new Date().toISOString();

    // Update post with success
    const { data: updatedPost, error: updateError } = await supabaseAdmin
      .from("content_posts")
      .update({
        platform_post_id: platformPostId,
        published_at: publishedAt,
        publish_error: null,
        status: "posted",
        updated_at: publishedAt,
      })
      .eq("id", postId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return jsonResponse(
        { message: "Published to LinkedIn but failed to update local record." },
        500,
      );
    }

    return jsonResponse({
      success: true,
      platformPostId,
      publishedAt,
      post: updatedPost,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error during LinkedIn publish.";
    return jsonResponse({ message }, 500);
  }
});
