import { updateContentPost } from "./contentService";

export async function publishPost(postId, platform) {
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
