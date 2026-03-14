const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);
export const hasApiBaseUrl = Boolean(apiBaseUrl);

export const runtimeMode = hasSupabaseEnv || hasApiBaseUrl ? "partial" : "mock";

export function getRuntimeSummary() {
  if (runtimeMode === "mock") {
    return {
      label: "Local Mock Mode",
      detail: "Using shared seed data with graceful fallback behavior.",
    };
  }

  if (hasSupabaseEnv && hasApiBaseUrl) {
    return {
      label: "Integration Ready",
      detail: "Supabase and API environment variables are configured.",
    };
  }

  return {
    label: "Partial Integration",
    detail: hasSupabaseEnv
      ? "Supabase is configured. AI generation is still using mock mode."
      : "API generation is configured. Persistence is still using mock mode.",
  };
}
