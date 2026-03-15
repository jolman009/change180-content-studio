import {
  fromContentPostRecord,
  toContentPostRecord,
  toContentPostUpdate,
} from "../lib/contentDraft";
import { demoContentPosts } from "../lib/demoData";
import { hasSupabaseEnv } from "../lib/runtime";
import { supabase } from "../lib/supabaseClient";

const CONTENT_POSTS_STORAGE_KEY = "change180.contentPosts";
const CONTENT_POST_SELECT =
  "id, platform, content_type, pillar, goal, tone, topic, context, status, hook, body, cta, hashtags, visual_direction, created_at, scheduled_for, platform_post_id, published_at, publish_error";

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

function ensureSeedContentPosts() {
  const storedPosts = getStoredContentPosts();
  if (storedPosts.length > 0) {
    return storedPosts;
  }

  const seededPosts = demoContentPosts.map((post) => ({
    id: post.id,
    ...toContentPostRecord(post),
    created_at: post.createdAt,
  }));

  setStoredContentPosts(seededPosts);
  return seededPosts;
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

export async function updateContentPost(postId, updates) {
  if (!hasSupabaseEnv || !supabase) {
    const storedPosts = getStoredContentPosts();
    const postIndex = storedPosts.findIndex((post) => post.id === postId);

    if (postIndex === -1) {
      throw new Error("Content post not found.");
    }

    const updatedRecord = {
      ...storedPosts[postIndex],
      ...toContentPostRecord({
        ...fromContentPostRecord(storedPosts[postIndex]),
        ...updates,
      }),
      id: postId,
      scheduled_for:
        updates.scheduledFor !== undefined
          ? updates.scheduledFor || null
          : storedPosts[postIndex].scheduled_for ?? null,
      created_at: storedPosts[postIndex].created_at,
    };

    const nextPosts = storedPosts.slice();
    nextPosts[postIndex] = updatedRecord;
    setStoredContentPosts(nextPosts);

    return {
      data: fromContentPostRecord(updatedRecord),
      source: "local",
    };
  }

  const { data, error } = await supabase
    .from("content_posts")
    .update(toContentPostUpdate(updates))
    .eq("id", postId)
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
      data: ensureSeedContentPosts().map(fromContentPostRecord),
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

export async function getContentPostById(postId) {
  if (!hasSupabaseEnv || !supabase) {
    const post = ensureSeedContentPosts()
      .map(fromContentPostRecord)
      .find((item) => item.id === postId);

    if (!post) {
      throw new Error("Content post not found.");
    }

    return {
      data: post,
      source: "local",
    };
  }

  const { data, error } = await supabase
    .from("content_posts")
    .select(CONTENT_POST_SELECT)
    .eq("id", postId)
    .single();

  if (error) throw error;

  return {
    data: fromContentPostRecord(data),
    source: "supabase",
  };
}
