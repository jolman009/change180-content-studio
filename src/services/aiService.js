import {
  applyMockToneAction,
  buildGenerateContentRequest,
  buildRewriteContentRequest,
  normalizeGenerateContentResponse,
} from "../lib/aiGeneration";
import {
  normalizeGeneratedContent,
} from "../lib/contentDraft";
import { apiPost } from "../lib/api";
import { mockGeneratedContent } from "../lib/mockData";
import { hasApiBaseUrl } from "../lib/runtime";

const GENERATE_CONTENT_ENDPOINT = "/generate-content";
const RETRY_ATTEMPTS = 2;

async function requestWithRetry(requestFactory, attempts = RETRY_ATTEMPTS) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await requestFactory();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function generateContent(input, brandProfile) {
  const payload = buildGenerateContentRequest(input, brandProfile);

  if (!hasApiBaseUrl) {
    return normalizeGeneratedContent(mockGeneratedContent);
  }

  const response = await requestWithRetry(() => apiPost(GENERATE_CONTENT_ENDPOINT, payload));
  return normalizeGenerateContentResponse(response);
}

export async function rewriteGeneratedContent(input, output, actionId, brandProfile) {
  const payload = buildRewriteContentRequest(input, output, actionId, brandProfile);

  if (!hasApiBaseUrl) {
    return applyMockToneAction(output, actionId);
  }

  const response = await requestWithRetry(() => apiPost(GENERATE_CONTENT_ENDPOINT, payload));
  return normalizeGenerateContentResponse(response);
}
