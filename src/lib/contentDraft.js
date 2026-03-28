import {
  CONTENT_PILLARS,
  CONTENT_TYPES,
  PLATFORM_GOALS,
  PLATFORM_TONES,
  PLATFORMS,
  POST_STATUSES,
} from "./constants";
import { mockContentForm, mockGeneratedContent } from "./mockData";

export const CONTENT_DRAFT_FIELDS = [
  "topic",
  "platform",
  "contentType",
  "pillar",
  "goal",
  "tone",
  "context",
];

export const GENERATED_CONTENT_FIELDS = ["hook", "caption", "cta", "hashtags", "visual", "mediaUrl", "mediaType"];

export const CONTENT_FIELD_LABELS = {
  topic: "Topic",
  platform: "Platform",
  contentType: "Content Type",
  pillar: "Pillar",
  goal: "Goal",
  tone: "Tone",
  context: "Additional Context",
};

export const GENERATED_FIELD_LABELS = {
  hook: "Hook",
  caption: "Caption",
  cta: "Call to Action",
  hashtags: "Hashtags",
  visual: "Visual Direction",
};

export const REQUIRED_CONTENT_DRAFT_FIELDS = ["topic", "platform", "contentType", "pillar"];
export const REQUIRED_GENERATED_FIELDS = ["hook", "caption", "cta"];

export const PLATFORM_CONTENT_TYPE_RULES = {
  Instagram: ["Caption Post", "Carousel", "Reel Script", "Quote Post", "Story Series"],
  Facebook: ["Caption Post", "Carousel", "Reel Script", "Quote Post"],
  LinkedIn: ["Caption Post", "Carousel", "Quote Post"],
  X: ["Caption Post", "Quote Post"],
};

export const PLATFORM_DEFAULTS = {
  Instagram: { goal: "Engagement", tone: "Grounded, hopeful, direct" },
  Facebook: { goal: "Community Building", tone: "Warm and invitational" },
  LinkedIn: { goal: "Education", tone: "Reflective and clarifying" },
  X: { goal: "Engagement", tone: "Practical and encouraging" },
};

function normalizeString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeOptionalDate(value) {
  return typeof value === "string" && value.trim() ? value : null;
}

function normalizeHashtags(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim());
  }

  if (typeof value === "string") {
    return value
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [...mockGeneratedContent.hashtags];
}

export function getAvailableContentTypes(platform) {
  return PLATFORM_CONTENT_TYPE_RULES[platform] ?? CONTENT_TYPES;
}

export function getPlatformDefaults(platform) {
  return PLATFORM_DEFAULTS[platform] ?? {
    goal: PLATFORM_GOALS[0],
    tone: PLATFORM_TONES[0],
  };
}

export function createContentDraftInput() {
  return normalizeContentDraftInput(mockContentForm);
}

export function createGeneratedContent() {
  return normalizeGeneratedContent(mockGeneratedContent);
}

export function normalizeContentDraftInput(input = {}) {
  const platform = PLATFORMS.includes(input.platform) ? input.platform : mockContentForm.platform;
  const availableContentTypes = getAvailableContentTypes(platform);
  const platformDefaults = getPlatformDefaults(platform);

  return {
    topic: normalizeString(input.topic, mockContentForm.topic),
    platform,
    contentType: availableContentTypes.includes(input.contentType)
      ? input.contentType
      : availableContentTypes[0],
    pillar: CONTENT_PILLARS.includes(input.pillar) ? input.pillar : mockContentForm.pillar,
    goal: PLATFORM_GOALS.includes(input.goal) ? input.goal : platformDefaults.goal,
    tone: PLATFORM_TONES.includes(input.tone) ? input.tone : platformDefaults.tone,
    context: normalizeString(input.context, mockContentForm.context),
  };
}

export function normalizeGeneratedContent(content = {}) {
  return {
    hook: normalizeString(content.hook, mockGeneratedContent.hook),
    caption: normalizeString(content.caption, mockGeneratedContent.caption),
    cta: normalizeString(content.cta, mockGeneratedContent.cta),
    hashtags: normalizeHashtags(content.hashtags),
    visual: normalizeString(content.visual, mockGeneratedContent.visual),
  };
}

export function validateContentDraftInput(input) {
  return REQUIRED_CONTENT_DRAFT_FIELDS.reduce((errors, field) => {
    if (!input[field]?.trim()) {
      errors[field] = `${CONTENT_FIELD_LABELS[field]} is required.`;
    }

    return errors;
  }, {});
}

export function validateGeneratedContent(content) {
  return REQUIRED_GENERATED_FIELDS.reduce((errors, field) => {
    if (!content[field]?.trim()) {
      errors[field] = `${GENERATED_FIELD_LABELS[field]} is required before saving.`;
    }

    return errors;
  }, {});
}

export function toGeneratedContentRequest(input, brandProfile) {
  const normalizedInput = normalizeContentDraftInput(input);

  return {
    topic: normalizedInput.topic,
    platform: normalizedInput.platform,
    contentType: normalizedInput.contentType,
    pillar: normalizedInput.pillar,
    goal: normalizedInput.goal,
    tone: normalizedInput.tone,
    context: normalizedInput.context,
    brandProfile,
  };
}

export function fromGeneratedContentResponse(response) {
  return normalizeGeneratedContent(response);
}

export function createContentPost(input, generatedContent) {
  const normalizedInput = normalizeContentDraftInput(input);
  const normalizedOutput = normalizeGeneratedContent(generatedContent);

  return {
    platform: normalizedInput.platform,
    contentType: normalizedInput.contentType,
    pillar: normalizedInput.pillar,
    goal: normalizedInput.goal,
    tone: normalizedInput.tone,
    topic: normalizedInput.topic,
    context: normalizedInput.context,
    status: POST_STATUSES[0],
    scheduledFor: "",
    hook: normalizedOutput.hook,
    body: normalizedOutput.caption,
    cta: normalizedOutput.cta,
    hashtags: normalizedOutput.hashtags,
    visualDirection: normalizedOutput.visual,
    mediaUrl: normalizedOutput.mediaUrl || null,
    mediaType: normalizedOutput.mediaType || null,
  };
}

export function toContentPostRecord(post) {
  return {
    platform: post.platform,
    content_type: post.contentType,
    pillar: post.pillar,
    goal: post.goal,
    tone: post.tone,
    topic: post.topic,
    context: post.context,
    status: post.status,
    hook: post.hook,
    body: post.body,
    cta: post.cta,
    hashtags: post.hashtags,
    visual_direction: post.visualDirection,
    media_url: post.mediaUrl ?? null,
    media_type: post.mediaType ?? null,
    scheduled_for: normalizeOptionalDate(post.scheduledFor),
    platform_post_id: post.platformPostId ?? null,
    published_at: post.publishedAt ?? null,
    publish_error: post.publishError ?? null,
  };
}

export function toContentPostUpdate(updates) {
  const updateRecord = {};

  if ("platform" in updates) updateRecord.platform = updates.platform;
  if ("contentType" in updates) updateRecord.content_type = updates.contentType;
  if ("pillar" in updates) updateRecord.pillar = updates.pillar;
  if ("goal" in updates) updateRecord.goal = updates.goal;
  if ("tone" in updates) updateRecord.tone = updates.tone;
  if ("topic" in updates) updateRecord.topic = updates.topic;
  if ("context" in updates) updateRecord.context = updates.context;
  if ("status" in updates) updateRecord.status = updates.status;
  if ("hook" in updates) updateRecord.hook = updates.hook;
  if ("body" in updates) updateRecord.body = updates.body;
  if ("cta" in updates) updateRecord.cta = updates.cta;
  if ("hashtags" in updates) updateRecord.hashtags = updates.hashtags;
  if ("visualDirection" in updates) updateRecord.visual_direction = updates.visualDirection;
  if ("mediaUrl" in updates) updateRecord.media_url = updates.mediaUrl ?? null;
  if ("mediaType" in updates) updateRecord.media_type = updates.mediaType ?? null;
  if ("scheduledFor" in updates) updateRecord.scheduled_for = normalizeOptionalDate(updates.scheduledFor);
  if ("platformPostId" in updates) updateRecord.platform_post_id = updates.platformPostId ?? null;
  if ("publishedAt" in updates) updateRecord.published_at = updates.publishedAt ?? null;
  if ("publishError" in updates) updateRecord.publish_error = updates.publishError ?? null;

  return updateRecord;
}

export function fromContentPostRecord(record = {}) {
  return {
    id: record.id,
    platform: normalizeString(record.platform, mockContentForm.platform),
    contentType: normalizeString(record.content_type, mockContentForm.contentType),
    pillar: normalizeString(record.pillar, mockContentForm.pillar),
    goal: normalizeString(record.goal, mockContentForm.goal),
    tone: normalizeString(record.tone, mockContentForm.tone),
    topic: normalizeString(record.topic, mockContentForm.topic),
    context: normalizeString(record.context, mockContentForm.context),
    status: POST_STATUSES.includes(record.status) ? record.status : POST_STATUSES[0],
    hook: normalizeString(record.hook, ""),
    body: normalizeString(record.body, ""),
    cta: normalizeString(record.cta, ""),
    hashtags: normalizeHashtags(record.hashtags ?? []),
    visualDirection: normalizeString(record.visual_direction, ""),
    mediaUrl: record.media_url ?? null,
    mediaType: record.media_type ?? null,
    createdAt: normalizeString(record.created_at, ""),
    scheduledFor: normalizeString(record.scheduled_for, ""),
    platformPostId: record.platform_post_id ?? null,
    publishedAt: record.published_at ?? null,
    publishError: record.publish_error ?? null,
  };
}

export function getDraftInputFromContentPost(post = {}) {
  return normalizeContentDraftInput({
    topic: post.topic,
    platform: post.platform,
    contentType: post.contentType,
    pillar: post.pillar,
    goal: post.goal,
    tone: post.tone,
    context: post.context,
  });
}

export function getGeneratedContentFromContentPost(post = {}) {
  const content = normalizeGeneratedContent({
    hook: post.hook,
    caption: post.body,
    cta: post.cta,
    hashtags: post.hashtags,
    visual: post.visualDirection,
  });
  content.mediaUrl = post.mediaUrl ?? null;
  content.mediaType = post.mediaType ?? null;
  return content;
}
