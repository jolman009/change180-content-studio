import { updateContentPost } from "./contentService";
import { hasSupabaseEnv, hasApiBaseUrl } from "../lib/runtime";
import { apiPost } from "../lib/api";

export async function publishPost(postId, platform) {
  // Real LinkedIn publishing when Supabase + API are configured
  if (hasSupabaseEnv && hasApiBaseUrl && platform === "LinkedIn") {
    const result = await apiPost("/linkedin-publish", { postId });
    return { data: result.post, source: "supabase" };
  }

  // Mock publishing for all other cases
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
