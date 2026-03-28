import { corsHeaders } from "../_shared/cors.ts";
import { isUUID } from "../_shared/validation.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GRAPH_BASE = "https://graph.facebook.com/v22.0";
const LINKEDIN_API = "https://api.linkedin.com/rest";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

type Metrics = {
  impressions: number | null;
  reach: number | null;
  engagement: number | null;
  clicks: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
};

function emptyMetrics(): Metrics {
  return { impressions: null, reach: null, engagement: null, clicks: null, likes: null, comments: null, shares: null };
}

async function fetchLinkedInMetrics(
  platformPostId: string,
  accessToken: string,
): Promise<Metrics> {
  const metrics = emptyMetrics();

  // LinkedIn Community Management API for post stats
  const response = await fetch(
    `${LINKEDIN_API}/socialActions/${platformPostId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202601",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    },
  );

  if (!response.ok) return metrics;

  const data = await response.json();
  metrics.likes = data.likesSummary?.totalLikes ?? null;
  metrics.comments = data.commentsSummary?.totalFirstLevelComments ?? null;
  metrics.shares = data.shareCount ?? null;
  metrics.engagement = (metrics.likes ?? 0) + (metrics.comments ?? 0) + (metrics.shares ?? 0);

  return metrics;
}

async function fetchFacebookMetrics(
  platformPostId: string,
  accessToken: string,
): Promise<Metrics> {
  const metrics = emptyMetrics();

  // Get basic engagement counts
  const response = await fetch(
    `${GRAPH_BASE}/${platformPostId}?fields=likes.summary(true),comments.summary(true),shares&access_token=${accessToken}`,
  );

  if (!response.ok) return metrics;

  const data = await response.json();
  metrics.likes = data.likes?.summary?.total_count ?? null;
  metrics.comments = data.comments?.summary?.total_count ?? null;
  metrics.shares = data.shares?.count ?? null;
  metrics.engagement = (metrics.likes ?? 0) + (metrics.comments ?? 0) + (metrics.shares ?? 0);

  // Get post insights for reach/impressions
  const insightsResponse = await fetch(
    `${GRAPH_BASE}/${platformPostId}/insights?metric=post_impressions,post_engaged_users&access_token=${accessToken}`,
  );

  if (insightsResponse.ok) {
    const insightsData = await insightsResponse.json();
    for (const item of insightsData.data ?? []) {
      if (item.name === "post_impressions") {
        metrics.impressions = item.values?.[0]?.value ?? null;
      }
      if (item.name === "post_engaged_users") {
        metrics.reach = item.values?.[0]?.value ?? null;
      }
    }
  }

  return metrics;
}

async function fetchInstagramMetrics(
  platformPostId: string,
  accessToken: string,
): Promise<Metrics> {
  const metrics = emptyMetrics();

  const response = await fetch(
    `${GRAPH_BASE}/${platformPostId}/insights?metric=impressions,reach,likes,comments,shares&access_token=${accessToken}`,
  );

  if (!response.ok) return metrics;

  const data = await response.json();
  for (const item of data.data ?? []) {
    if (item.name === "impressions") metrics.impressions = item.values?.[0]?.value ?? null;
    if (item.name === "reach") metrics.reach = item.values?.[0]?.value ?? null;
    if (item.name === "likes") metrics.likes = item.values?.[0]?.value ?? null;
    if (item.name === "comments") metrics.comments = item.values?.[0]?.value ?? null;
    if (item.name === "shares") metrics.shares = item.values?.[0]?.value ?? null;
  }

  metrics.engagement = (metrics.likes ?? 0) + (metrics.comments ?? 0) + (metrics.shares ?? 0);
  return metrics;
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

    // Get the post
    const { data: post, error: postError } = await supabaseAdmin
      .from("content_posts")
      .select("platform, platform_post_id")
      .eq("id", postId)
      .eq("user_id", user.id)
      .single();

    if (postError || !post) {
      return jsonResponse({ message: "Content post not found." }, 404);
    }

    if (!post.platform_post_id) {
      return jsonResponse({ message: "Post has not been published yet." }, 400);
    }

    // Get platform credential
    const { data: credential } = await supabaseAdmin
      .from("platform_credentials")
      .select("access_token")
      .eq("user_id", user.id)
      .eq("platform", post.platform)
      .single();

    if (!credential) {
      return jsonResponse({ message: `No ${post.platform} credential found.` }, 400);
    }

    let metrics: Metrics;

    if (post.platform === "LinkedIn") {
      metrics = await fetchLinkedInMetrics(post.platform_post_id, credential.access_token);
    } else if (post.platform === "Facebook") {
      metrics = await fetchFacebookMetrics(post.platform_post_id, credential.access_token);
    } else if (post.platform === "Instagram") {
      metrics = await fetchInstagramMetrics(post.platform_post_id, credential.access_token);
    } else {
      return jsonResponse({ message: `Analytics not supported for ${post.platform}.` }, 400);
    }

    // Upsert into post_analytics table
    const { error: upsertError } = await supabaseAdmin
      .from("post_analytics")
      .upsert(
        {
          post_id: postId,
          platform: post.platform,
          impressions: metrics.impressions,
          reach: metrics.reach,
          engagement: metrics.engagement,
          clicks: metrics.clicks,
          likes: metrics.likes,
          comments: metrics.comments,
          shares: metrics.shares,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: "post_id" },
      );

    if (upsertError) {
      // Return metrics even if upsert fails
      return jsonResponse({ metrics, stored: false });
    }

    return jsonResponse({ metrics, stored: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error fetching analytics.";
    return jsonResponse({ message }, 500);
  }
});
