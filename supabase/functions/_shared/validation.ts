/**
 * Shared input validation helpers for edge functions.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Check that a value is a non-empty string within max length. */
export function isNonEmptyString(value: unknown, maxLength = 10_000): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

/** Check that a value is a valid UUID v4 string. */
export function isUUID(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/** Check that a value looks like a valid URL. */
export function isValidUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Strip HTML tags to prevent XSS in published content. */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

/** Sanitize an array of hashtag strings. */
export function sanitizeHashtags(hashtags: unknown): string[] {
  if (!Array.isArray(hashtags)) return [];
  return hashtags
    .filter((h): h is string => typeof h === "string")
    .map((h) => h.trim())
    .filter((h) => h.length > 0 && h.length <= 100)
    .map((h) => (h.startsWith("#") ? h : `#${h}`))
    .map((h) => h.replace(/[<>"'&]/g, ""))
    .slice(0, 30);
}

/** Platform character limits for composed post content. */
export const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  LinkedIn: 3000,
  Facebook: 63206,
  Instagram: 2200,
  X: 280,
};

/** Truncate text to a platform's character limit. */
export function enforceCharLimit(text: string, platform: string): string {
  const limit = PLATFORM_CHAR_LIMITS[platform];
  if (!limit) return text;
  return text.length > limit ? text.slice(0, limit) : text;
}

/** Validate the generate-content request body and return errors (empty array = valid). */
export function validateGenerateContentBody(body: Record<string, unknown>): string[] {
  const errors: string[] = [];

  if (body.mode !== "generate" && body.mode !== "rewrite") {
    errors.push("mode must be 'generate' or 'rewrite'.");
  }

  const input = body.input as Record<string, unknown> | undefined;
  if (!input || typeof input !== "object") {
    errors.push("input object is required.");
    return errors;
  }

  if (!isNonEmptyString(input.topic, 2000)) {
    errors.push("input.topic is required (max 2000 characters).");
  }
  if (!isNonEmptyString(input.platform, 50)) {
    errors.push("input.platform is required.");
  }
  if (!isNonEmptyString(input.contentType, 100)) {
    errors.push("input.contentType is required.");
  }
  if (!isNonEmptyString(input.pillar, 100)) {
    errors.push("input.pillar is required.");
  }
  if (!isNonEmptyString(input.goal, 200)) {
    errors.push("input.goal is required.");
  }
  if (!isNonEmptyString(input.tone, 200)) {
    errors.push("input.tone is required.");
  }
  if (input.context != null && typeof input.context === "string" && input.context.length > 5000) {
    errors.push("input.context exceeds 5000 character limit.");
  }

  if (body.mode === "rewrite") {
    const currentOutput = body.currentOutput as Record<string, unknown> | undefined;
    if (!currentOutput || typeof currentOutput !== "object") {
      errors.push("currentOutput is required for rewrite mode.");
    }
  }

  return errors;
}

/** Validate OAuth exchange request body. */
export function validateOAuthBody(body: Record<string, unknown>): string[] {
  const errors: string[] = [];

  if (!isNonEmptyString(body.code, 2000)) {
    errors.push("Authorization code is required (max 2000 characters).");
  }
  if (!isValidUrl(body.redirectUri)) {
    errors.push("A valid redirectUri is required.");
  }

  return errors;
}
