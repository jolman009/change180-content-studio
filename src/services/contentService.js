import { supabase } from "../lib/supabaseClient";

export async function saveContentPost(post) {
  const { data, error } = await supabase
    .from("content_posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContentPosts() {
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}