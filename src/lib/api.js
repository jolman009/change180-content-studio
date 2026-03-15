import { hasApiBaseUrl } from "./runtime";
import { supabase } from "./supabaseClient";

export async function apiPost(path, body) {
  if (!hasApiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not set. The app is running in local mock mode.");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  // Attach user JWT if authenticated
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.access_token) {
      headers["Authorization"] = `Bearer ${data.session.access_token}`;
    }
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}
