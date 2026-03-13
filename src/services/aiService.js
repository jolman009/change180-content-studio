import { apiPost } from "../lib/api";

export async function generateContent(payload) {
  return apiPost("/generate-content", payload);
}