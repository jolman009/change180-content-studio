import { corsHeaders } from "../_shared/cors.ts";
import { stripHtml, sanitizeHashtags, enforceCharLimit } from "../_shared/validation.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LINKEDIN_POSTS_URL = "https://api.linkedin.com/rest/posts";
const GRAPH_BASE = "https://graph.facebook.com/v22.0";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function composeMessage(post: {
  hook: string | null;
  body: string | null;
  cta: string | null;
  hashtags: string[] | null;
}, platform: string): string {
  const parts = [post.hook, post.body, post.cta]
    .filter(Boolean)
    .map((t) => stripHtml(t as string));
  const hashtags = sanitizeHashtags(post.hashtags).join(" ");
  if (hashtags) parts.push(hashtags);
  return enforceCharLimit(parts.join("\n\n"), platform);
}

async function publishToLinkedIn(
  post: { hook: string; body: string; cta: string; hashtags: string[] },
  credential: { access_token: string; platform_user_id: string },
): Promise<{ platformPostId: string | null }> {
  const commentary = composeMessage(post, "LinkedIn");

  const orgId = Deno.env.get("LINKEDIN_ORG_ID");
  const author = orgId
    ? `urn:li:organization:${orgId}`
    : `urn:li:person:${credential.platform_user_id}`;

  const response = await fetch(LINKEDIN_POSTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credential.access_token}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202601",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author,
      commentary,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || err.error || "LinkedIn API request failed.");
  }

  return { platformPostId: response.headers.get("x-restli-id") || null };
}

async function publishToFacebook(
  post: { hook: string; body: string; cta: string; hashtags: string[] },
  credential: { access_token: string; platform_user_id: string },
): Promise<{ platformPostId: string | null }> {
  const message = composeMessage(post, "Facebook");

  const response = await fetch(
    `${GRAPH_BASE}/${credential.platform_user_id}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        access_token: credential.access_token,
      }),
    },
  );

  const result = await response.json();
  if (!response.ok || !result.id) {
    throw new Error(result.error?.message || result.error || "Facebook API request failed.");
  }

  return { platformPostId: result.id };
}

async function publishToInstagram(
  post: { hook: string; body: string; cta: string; hashtags: string[]; media_url: string | null },
  credential: { access_token: string; platform_user_id: string },
): Promise<{ platformPostId: string | null }> {
  if (!post.media_url) {
    throw new Error("Instagram feed posts require an image.");
  }

  const caption = composeMessage(post, "Instagram");

  // Step 1: Create media container
  const containerResponse = await fetch(
    `${GRAPH_BASE}/${credential.platform_user_id}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: post.media_url,
        caption,
        access_token: credential.access_token,
      }),
    },
  );

  const containerResult = await containerResponse.json();
  if (!containerResponse.ok || !containerResult.id) {
    throw new Error(containerResult.error?.message || "Failed to create Instagram media container.");
  }

  // Step 2: Publish the container
  const publishResponse = await fetch(
    `${GRAPH_BASE}/${credential.platform_user_id}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerResult.id,
        access_token: credential.access_token,
      }),
    },
  );

  const publishResult = await publishResponse.json();
  if (!publishResponse.ok || !publishResult.id) {
    throw new Error(publishResult.error?.message || "Failed to publish Instagram media.");
  }

  return { platformPostId: publishResult.id };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed." }, 405);
  }

  // This function can be called by a cron job (with service role key) or by an authenticated user
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ message: "Missing authorization token." }, 401);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Find all posts that are scheduled and due
    const now = new Date().toISOString();
    const { data: duePosts, error: queryError } = await supabaseAdmin
      .from("content_posts")
      .select("id, user_id, platform, hook, body, cta, hashtags, media_url")
      .eq("status", "scheduled")
      .lte("scheduled_for", now)
      .is("published_at", null);

    if (queryError) {
      return jsonResponse({ message: "Failed to query scheduled posts." }, 500);
    }

    if (!duePosts || duePosts.length === 0) {
      return jsonResponse({ published: 0, errors: 0, message: "No posts due for publishing." });
    }

    let published = 0;
    let errors = 0;
    const results: { postId: string; status: string; error?: string }[] = [];

    for (const post of duePosts) {
      try {
        // Get platform credential for the post's owner
        const { data: credential } = await supabaseAdmin
          .from("platform_credentials")
          .select("access_token, platform_user_id, token_expires_at")
          .eq("user_id", post.user_id)
          .eq("platform", post.platform)
          .single();

        if (!credential) {
          throw new Error(`No ${post.platform} credential found.`);
        }

        // Check token expiry
        if (
          credential.token_expires_at &&
          new Date(credential.token_expires_at) < new Date()
        ) {
          throw new Error(`${post.platform} token has expired.`);
        }

        let publishResult: { platformPostId: string | null };

        if (post.platform === "LinkedIn") {
          publishResult = await publishToLinkedIn(post, credential);
        } else if (post.platform === "Facebook") {
          publishResult = await publishToFacebook(post, credential);
        } else if (post.platform === "Instagram") {
          publishResult = await publishToInstagram(post, credential);
        } else {
          throw new Error(`Publishing to ${post.platform} is not yet supported.`);
        }

        // Update post as published
        await supabaseAdmin
          .from("content_posts")
          .update({
            platform_post_id: publishResult.platformPostId,
            published_at: new Date().toISOString(),
            publish_error: null,
            status: "posted",
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id);

        published++;
        results.push({ postId: post.id, status: "posted" });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown publishing error.";

        // Update post with error but keep scheduled status so it can retry
        await supabaseAdmin
          .from("content_posts")
          .update({
            publish_error: errorMessage,
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id);

        errors++;
        results.push({ postId: post.id, status: "error", error: errorMessage });
      }
    }

    return jsonResponse({ published, errors, results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error during scheduled publish.";
    return jsonResponse({ message }, 500);
  }
});
