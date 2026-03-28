import { updateContentPost } from "./contentService";
import { hasSupabaseEnv, hasApiBaseUrl } from "../lib/runtime";
import { apiPost } from "../lib/api";

const PLATFORM_ENDPOINTS = {
  LinkedIn: "/linkedin-publish",
  Facebook: "/facebook-publish",
  Instagram: "/instagram-publish",
  X: "/x-publish",
};

export async function publishPost(postId, platform) {
  const endpoint = PLATFORM_ENDPOINTS[platform];

  if (hasSupabaseEnv && hasApiBaseUrl && endpoint) {
    const result = await apiPost(endpoint, { postId });
    return { data: result.post, source: "supabase" };
  }

  // Mock publishing for unconfigured platforms or local mode
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const publishedAt = new Date().toISOString();
  const platformPostId = `mock-${platform.toLowerCase()}-${Date.now()}`;

  const result = await updateContentPost(postId, {
    platformPostId,
    publishedAt,
    publishError: null,
    status: "posted",
  });

  return result;
}
