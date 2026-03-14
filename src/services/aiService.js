import {
  fromGeneratedContentResponse,
  toGeneratedContentRequest,
} from "../lib/contentDraft";
import { apiPost } from "../lib/api";
import { mockGeneratedContent } from "../lib/mockData";
import { hasApiBaseUrl } from "../lib/runtime";

export async function generateContent(input, brandProfile) {
  const payload = toGeneratedContentRequest(input, brandProfile);

  if (!hasApiBaseUrl) {
    return fromGeneratedContentResponse(mockGeneratedContent);
  }

  const response = await apiPost("/generate-content", payload);
  return fromGeneratedContentResponse(response);
}
