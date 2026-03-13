import { supabase } from "../lib/supabaseClient";

export async function saveBrandProfile(profile) {
  const { data, error } = await supabase
    .from("brand_profiles")
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}