import { corsHeaders } from "../_shared/cors.ts";
import { isUUID, stripHtml, sanitizeHashtags, enforceCharLimit } from "../_shared/validation.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed." }, 405);
  }

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

    // Get Instagram credential (stored during meta-oauth)
    const { data: credential, error: credError } = await supabaseAdmin
      .from("platform_credentials")
      .select("access_token, token_expires_at, platform_user_id")
      .eq("user_id", user.id)
      .eq("platform", "Instagram")
      .single();

    if (credError || !credential) {
      return jsonResponse(
        { message: "Instagram account not connected. Please connect your account first." },
        400,
      );
    }

    if (
      credential.token_expires_at &&
      new Date(credential.token_expires_at) < new Date()
    ) {
      return jsonResponse(
        { message: "Instagram token has expired. Please reconnect your account." },
        401,
      );
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

    // Instagram requires an image for feed posts
    if (!post.media_url) {
      return jsonResponse(
        { message: "Instagram feed posts require an image. Please attach an image before publishing." },
        400,
      );
    }

    // Compose caption (sanitized, 2200 char limit)
    const parts = [post.hook, post.body, post.cta]
      .filter(Boolean)
      .map((t: string) => stripHtml(t));
    const hashtags = sanitizeHashtags(post.hashtags).join(" ");
    if (hashtags) {
      parts.push(hashtags);
    }
    const caption = enforceCharLimit(parts.join("\n\n"), "Instagram");

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
      const errorMessage =
        containerResult.error?.message || "Failed to create Instagram media container.";

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

    const containerId = containerResult.id as string;

    // Step 2: Publish the media container
    const publishResponse = await fetch(
      `${GRAPH_BASE}/${credential.platform_user_id}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: credential.access_token,
        }),
      },
    );

    const publishResult = await publishResponse.json();

    if (!publishResponse.ok || !publishResult.id) {
      const errorMessage =
        publishResult.error?.message || "Failed to publish Instagram media.";

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

    const platformPostId = publishResult.id as string;
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
        { message: "Published to Instagram but failed to update local record." },
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
      error instanceof Error ? error.message : "Unexpected error during Instagram publish.";
    return jsonResponse({ message }, 500);
  }
});
