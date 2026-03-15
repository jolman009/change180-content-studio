import {
  fromPlatformCredentialRecord,
  toPlatformCredentialRecord,
} from "../lib/platformCredential";
import { hasSupabaseEnv } from "../lib/runtime";
import { supabase } from "../lib/supabaseClient";

const PLATFORM_CREDENTIALS_STORAGE_KEY = "change180.platformCredentials";
const PLATFORM_CREDENTIAL_SELECT =
  "id, platform, access_token, refresh_token, token_expires_at, platform_user_id, platform_username, connected_at, updated_at";

function getStoredCredentials() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(PLATFORM_CREDENTIALS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function setStoredCredentials(credentials) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PLATFORM_CREDENTIALS_STORAGE_KEY,
    JSON.stringify(credentials),
  );
}

export async function getConnectedPlatforms() {
  if (!hasSupabaseEnv || !supabase) {
    return {
      data: getStoredCredentials().map(fromPlatformCredentialRecord),
      source: "local",
    };
  }

  const { data, error } = await supabase
    .from("platform_credentials")
    .select(PLATFORM_CREDENTIAL_SELECT)
    .order("connected_at", { ascending: false });

  if (error) throw error;

  return {
    data: data.map(fromPlatformCredentialRecord),
    source: "supabase",
  };
}

export async function savePlatformCredential(credential) {
  if (!hasSupabaseEnv || !supabase) {
    const stored = getStoredCredentials();
    const record = {
      id: `local-${Date.now()}`,
      ...toPlatformCredentialRecord(credential),
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existingIndex = stored.findIndex(
      (c) => c.platform === credential.platform,
    );

    if (existingIndex !== -1) {
      record.id = stored[existingIndex].id;
      record.connected_at = stored[existingIndex].connected_at;
      stored[existingIndex] = record;
    } else {
      stored.push(record);
    }

    setStoredCredentials(stored);

    return {
      data: fromPlatformCredentialRecord(record),
      source: "local",
    };
  }

  const { data, error } = await supabase
    .from("platform_credentials")
    .upsert(toPlatformCredentialRecord(credential), {
      onConflict: "user_id,platform",
    })
    .select(PLATFORM_CREDENTIAL_SELECT)
    .single();

  if (error) throw error;

  return {
    data: fromPlatformCredentialRecord(data),
    source: "supabase",
  };
}

export async function disconnectPlatform(platform) {
  if (!hasSupabaseEnv || !supabase) {
    const stored = getStoredCredentials();
    const filtered = stored.filter((c) => c.platform !== platform);
    setStoredCredentials(filtered);

    return { data: null, source: "local" };
  }

  const { error } = await supabase
    .from("platform_credentials")
    .delete()
    .eq("platform", platform);

  if (error) throw error;

  return { data: null, source: "supabase" };
}
