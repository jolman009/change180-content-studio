import {
  fromBrandProfileRecord,
  toBrandProfileRecord,
} from "../lib/brandProfile";
import { hasSupabaseEnv } from "../lib/runtime";
import { supabase } from "../lib/supabaseClient";

const BRAND_PROFILE_STORAGE_KEY = "change180.brandProfile";
const BRAND_PROFILE_SELECT =
  "id, brand_name, target_audience, mission, tone_rules, preferred_ctas, banned_phrases, created_at, updated_at";

function getStoredBrandProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawProfile = window.localStorage.getItem(BRAND_PROFILE_STORAGE_KEY);
  return rawProfile ? JSON.parse(rawProfile) : null;
}

function setStoredBrandProfile(profile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BRAND_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export async function getBrandProfile() {
  if (!hasSupabaseEnv || !supabase) {
    return {
      data: fromBrandProfileRecord(getStoredBrandProfile()),
      source: "local",
    };
  }

  const { data, error } = await supabase
    .from("brand_profiles")
    .select(BRAND_PROFILE_SELECT)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  const normalizedProfile = fromBrandProfileRecord(data);
  setStoredBrandProfile(normalizedProfile);

  return {
    data: normalizedProfile,
    source: "supabase",
  };
}

export async function saveBrandProfile(profile) {
  if (!hasSupabaseEnv || !supabase) {
    const normalizedProfile = fromBrandProfileRecord(profile);
    setStoredBrandProfile(normalizedProfile);

    return {
      data: normalizedProfile,
      source: "local",
    };
  }

  const nextRecord = toBrandProfileRecord(profile);
  const { data: existingRecord, error: existingRecordError } = await supabase
    .from("brand_profiles")
    .select(BRAND_PROFILE_SELECT)
    .limit(1)
    .maybeSingle();

  if (existingRecordError) throw existingRecordError;

  const writeQuery =
    existingRecord?.id != null
      ? supabase
          .from("brand_profiles")
          .update(nextRecord)
          .eq("id", existingRecord.id)
          .select(BRAND_PROFILE_SELECT)
          .single()
      : supabase
          .from("brand_profiles")
          .insert(nextRecord)
          .select(BRAND_PROFILE_SELECT)
          .single();

  const { data, error } = await writeQuery;

  if (error) throw error;

  const normalizedProfile = fromBrandProfileRecord(data);
  setStoredBrandProfile(normalizedProfile);

  return {
    data: normalizedProfile,
    source: "supabase",
  };
}
