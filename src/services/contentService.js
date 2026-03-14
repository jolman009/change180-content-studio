import { hasSupabaseEnv, supabase } from "../lib/supabaseClient";

export async function saveContentPost(post) {
  if (!hasSupabaseEnv || !supabase) {
    throw new Error("Supabase is not configured. Content persistence is unavailable.");
  }

  const { data, error } = await supabase
    .from("content_posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContentPosts() {
  if (!hasSupabaseEnv || !supabase) {
    throw new Error("Supabase is not configured. Content loading is unavailable.");
  }

  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
