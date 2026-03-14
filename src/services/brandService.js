import { hasSupabaseEnv, supabase } from "../lib/supabaseClient";

export async function saveBrandProfile(profile) {
  if (!hasSupabaseEnv || !supabase) {
    throw new Error("Supabase is not configured. Brand profile persistence is unavailable.");
  }

  const { data, error } = await supabase
    .from("brand_profiles")
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}
