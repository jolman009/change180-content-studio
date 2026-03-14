import {
  fromContentPostRecord,
  toContentPostRecord,
} from "../lib/contentDraft";
import { hasSupabaseEnv } from "../lib/runtime";
import { supabase } from "../lib/supabaseClient";

const CONTENT_POSTS_STORAGE_KEY = "change180.contentPosts";
const CONTENT_POST_SELECT =
  "id, platform, content_type, pillar, goal, tone, topic, context, status, hook, body, cta, hashtags, visual_direction, created_at, scheduled_for";

function getStoredContentPosts() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawPosts = window.localStorage.getItem(CONTENT_POSTS_STORAGE_KEY);
  return rawPosts ? JSON.parse(rawPosts) : [];
}

function setStoredContentPosts(posts) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONTENT_POSTS_STORAGE_KEY, JSON.stringify(posts));
}

export async function saveContentPost(post) {
  if (!hasSupabaseEnv || !supabase) {
    const storedPosts = getStoredContentPosts();
    const localRecord = {
      id: post.id ?? `local-${Date.now()}`,
      ...toContentPostRecord(post),
      created_at: new Date().toISOString(),
    };
    const nextPosts = [localRecord, ...storedPosts];

    setStoredContentPosts(nextPosts);

    return {
      data: fromContentPostRecord(localRecord),
      source: "local",
    };
  }

  const { data, error } = await supabase
    .from("content_posts")
    .insert(toContentPostRecord(post))
    .select(CONTENT_POST_SELECT)
    .single();

  if (error) throw error;

  return {
    data: fromContentPostRecord(data),
    source: "supabase",
  };
}

export async function getContentPosts() {
  if (!hasSupabaseEnv || !supabase) {
    return {
      data: getStoredContentPosts().map(fromContentPostRecord),
      source: "local",
    };
  }

  const { data, error } = await supabase
    .from("content_posts")
    .select(CONTENT_POST_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    data: data.map(fromContentPostRecord),
    source: "supabase",
  };
}
