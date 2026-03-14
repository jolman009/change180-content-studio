import { hasApiBaseUrl } from "./runtime";

export async function apiPost(path, body) {
  if (!hasApiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not set. The app is running in local mock mode.");
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}
