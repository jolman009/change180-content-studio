import { describe, expect, it } from "vitest";
import {
  normalizeContentDraftInput,
  normalizeGeneratedContent,
  validateContentDraftInput,
  validateGeneratedContent,
  createContentPost,
  toContentPostRecord,
  fromContentPostRecord,
  toContentPostUpdate,
  getDraftInputFromContentPost,
  getGeneratedContentFromContentPost,
  getAvailableContentTypes,
  getPlatformDefaults,
  PLATFORM_CONTENT_TYPE_RULES,
  PLATFORM_DEFAULTS,
} from "../contentDraft";

describe("normalizeContentDraftInput", () => {
  it("returns defaults when called with empty object", () => {
    const result = normalizeContentDraftInput({});
    expect(result).toHaveProperty("topic");
    expect(result).toHaveProperty("platform");
    expect(result).toHaveProperty("contentType");
    expect(result).toHaveProperty("pillar");
    expect(result).toHaveProperty("goal");
    expect(result).toHaveProperty("tone");
    expect(result).toHaveProperty("context");
  });

  it("preserves valid input values", () => {
    const input = {
      topic: "Mindset reset",
      platform: "LinkedIn",
      contentType: "Caption Post",
      pillar: "Mindset",
      goal: "Education",
      tone: "Reflective and clarifying",
      context: "Focus on professionals",
    };
    const result = normalizeContentDraftInput(input);
    expect(result.topic).toBe("Mindset reset");
    expect(result.platform).toBe("LinkedIn");
    expect(result.contentType).toBe("Caption Post");
    expect(result.context).toBe("Focus on professionals");
  });

  it("rejects invalid platform and falls back", () => {
    const result = normalizeContentDraftInput({ platform: "TikTok" });
    expect(["Instagram", "Facebook", "LinkedIn", "X"]).toContain(result.platform);
  });

  it("adjusts contentType when not available for platform", () => {
    const result = normalizeContentDraftInput({
      platform: "X",
      contentType: "Reel Script",
    });
    expect(PLATFORM_CONTENT_TYPE_RULES["X"]).toContain(result.contentType);
    expect(result.contentType).not.toBe("Reel Script");
  });
});

describe("normalizeGeneratedContent", () => {
  it("returns defaults when called with empty object", () => {
    const result = normalizeGeneratedContent({});
    expect(result).toHaveProperty("hook");
    expect(result).toHaveProperty("caption");
    expect(result).toHaveProperty("cta");
    expect(result).toHaveProperty("hashtags");
    expect(result).toHaveProperty("visual");
    expect(Array.isArray(result.hashtags)).toBe(true);
  });

  it("normalizes hashtags from string", () => {
    const result = normalizeGeneratedContent({ hashtags: "#one #two #three" });
    expect(result.hashtags).toEqual(["#one", "#two", "#three"]);
  });

  it("normalizes hashtags from array", () => {
    const result = normalizeGeneratedContent({ hashtags: ["#a", "#b"] });
    expect(result.hashtags).toEqual(["#a", "#b"]);
  });

  it("preserves valid string fields", () => {
    const result = normalizeGeneratedContent({
      hook: "Start here",
      caption: "Body text",
      cta: "Click now",
      visual: "Photo of sunset",
    });
    expect(result.hook).toBe("Start here");
    expect(result.caption).toBe("Body text");
    expect(result.cta).toBe("Click now");
    expect(result.visual).toBe("Photo of sunset");
  });
});

describe("validateContentDraftInput", () => {
  it("returns errors for empty required fields", () => {
    const errors = validateContentDraftInput({
      topic: "",
      platform: "",
      contentType: "",
      pillar: "",
    });
    expect(errors).toHaveProperty("topic");
    expect(errors).toHaveProperty("platform");
    expect(errors).toHaveProperty("contentType");
    expect(errors).toHaveProperty("pillar");
  });

  it("returns no errors when required fields are filled", () => {
    const errors = validateContentDraftInput({
      topic: "Growth",
      platform: "Instagram",
      contentType: "Caption Post",
      pillar: "Mindset",
      goal: "",
      tone: "",
      context: "",
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("returns errors for whitespace-only fields", () => {
    const errors = validateContentDraftInput({
      topic: "   ",
      platform: "Instagram",
      contentType: "Caption Post",
      pillar: "Mindset",
    });
    expect(errors).toHaveProperty("topic");
  });
});

describe("validateGeneratedContent", () => {
  it("returns errors for missing required generated fields", () => {
    const errors = validateGeneratedContent({ hook: "", caption: "", cta: "" });
    expect(errors).toHaveProperty("hook");
    expect(errors).toHaveProperty("caption");
    expect(errors).toHaveProperty("cta");
  });

  it("returns no errors when required generated fields are filled", () => {
    const errors = validateGeneratedContent({
      hook: "Open strong",
      caption: "Body here",
      cta: "Act now",
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe("createContentPost", () => {
  it("merges input and generated content into a post object", () => {
    const input = {
      topic: "Morning routine",
      platform: "Instagram",
      contentType: "Caption Post",
      pillar: "Mindset",
      goal: "Engagement",
      tone: "Grounded, hopeful, direct",
      context: "",
    };
    const generated = {
      hook: "Start your day right",
      caption: "Here's the plan",
      cta: "Save this post",
      hashtags: ["#morning"],
      visual: "Flat lay photo",
    };
    const post = createContentPost(input, generated);

    expect(post.platform).toBe("Instagram");
    expect(post.hook).toBe("Start your day right");
    expect(post.body).toBe("Here's the plan");
    expect(post.cta).toBe("Save this post");
    expect(post.status).toBe("draft");
    expect(post.hashtags).toEqual(["#morning"]);
  });
});

describe("toContentPostRecord / fromContentPostRecord", () => {
  it("converts camelCase to snake_case and back", () => {
    const post = {
      platform: "LinkedIn",
      contentType: "Quote Post",
      pillar: "Mindset",
      goal: "Education",
      tone: "Reflective",
      topic: "Resilience",
      context: "",
      status: "draft",
      hook: "Hook",
      body: "Body",
      cta: "CTA",
      hashtags: ["#test"],
      visualDirection: "Visual",
      scheduledFor: "2026-04-01",
      platformPostId: null,
      publishedAt: null,
      publishError: null,
    };

    const record = toContentPostRecord(post);
    expect(record.content_type).toBe("Quote Post");
    expect(record.visual_direction).toBe("Visual");
    expect(record.scheduled_for).toBe("2026-04-01");

    const restored = fromContentPostRecord({ ...record, id: "abc-123" });
    expect(restored.contentType).toBe("Quote Post");
    expect(restored.visualDirection).toBe("Visual");
    expect(restored.id).toBe("abc-123");
  });
});

describe("toContentPostUpdate", () => {
  it("only includes provided fields", () => {
    const update = toContentPostUpdate({ status: "approved", scheduledFor: "2026-05-01" });
    expect(update).toEqual({ status: "approved", scheduled_for: "2026-05-01" });
    expect(update).not.toHaveProperty("platform");
  });

  it("converts null scheduledFor to null", () => {
    const update = toContentPostUpdate({ scheduledFor: "" });
    expect(update.scheduled_for).toBeNull();
  });
});

describe("getDraftInputFromContentPost / getGeneratedContentFromContentPost", () => {
  it("extracts draft input from a content post", () => {
    const post = {
      topic: "Topic",
      platform: "Facebook",
      contentType: "Caption Post",
      pillar: "Mindset",
      goal: "Community Building",
      tone: "Warm and invitational",
      context: "Some context",
    };
    const input = getDraftInputFromContentPost(post);
    expect(input.topic).toBe("Topic");
    expect(input.platform).toBe("Facebook");
  });

  it("extracts generated content from a content post", () => {
    const post = {
      hook: "H",
      body: "B",
      cta: "C",
      hashtags: ["#x"],
      visualDirection: "V",
    };
    const content = getGeneratedContentFromContentPost(post);
    expect(content.hook).toBe("H");
    expect(content.caption).toBe("B");
    expect(content.visual).toBe("V");
  });
});

describe("getAvailableContentTypes", () => {
  it("returns platform-specific types for known platforms", () => {
    expect(getAvailableContentTypes("X")).toEqual(PLATFORM_CONTENT_TYPE_RULES["X"]);
    expect(getAvailableContentTypes("Instagram")).toEqual(PLATFORM_CONTENT_TYPE_RULES["Instagram"]);
  });

  it("returns all content types for unknown platform", () => {
    const result = getAvailableContentTypes("Unknown");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("getPlatformDefaults", () => {
  it("returns platform-specific defaults", () => {
    expect(getPlatformDefaults("LinkedIn")).toEqual(PLATFORM_DEFAULTS["LinkedIn"]);
  });

  it("returns fallback for unknown platform", () => {
    const result = getPlatformDefaults("Unknown");
    expect(result).toHaveProperty("goal");
    expect(result).toHaveProperty("tone");
  });
});
