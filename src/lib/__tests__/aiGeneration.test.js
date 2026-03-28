import { describe, expect, it } from "vitest";
import {
  buildGenerateContentRequest,
  buildRewriteContentRequest,
  normalizeGenerateContentResponse,
  applyMockToneAction,
  AI_TONE_ACTIONS,
} from "../aiGeneration";

const sampleInput = {
  topic: "Morning routine",
  platform: "Instagram",
  contentType: "Caption Post",
  pillar: "Mindset",
  goal: "Engagement",
  tone: "Grounded, hopeful, direct",
  context: "",
};

const sampleOutput = {
  hook: "Start your day right",
  caption: "Build a morning routine that works for your life, not someone else's playbook.",
  cta: "Save this post for tomorrow morning.",
  hashtags: ["#morning", "#routine"],
  visual: "Flat lay of journal and coffee",
};

const sampleBrandProfile = {
  brand_name: "Change180",
  target_audience: "Adults 30-55",
  mission: "Help people reset",
  tone_rules: "Be direct",
  preferred_ctas: "Book a call",
  banned_phrases: "Just be positive",
};

describe("buildGenerateContentRequest", () => {
  it("builds a generate request with brand profile", () => {
    const req = buildGenerateContentRequest(sampleInput, sampleBrandProfile);
    expect(req.mode).toBe("generate");
    expect(req.input).toBe(sampleInput);
    expect(req.brandProfile.brandName).toBe("Change180");
    expect(req.brandProfile.audience).toBe("Adults 30-55");
  });

  it("handles null brand profile", () => {
    const req = buildGenerateContentRequest(sampleInput, null);
    expect(req.brandProfile).toBeNull();
  });
});

describe("buildRewriteContentRequest", () => {
  it("builds a rewrite request with action", () => {
    const req = buildRewriteContentRequest(sampleInput, sampleOutput, "softer", sampleBrandProfile);
    expect(req.mode).toBe("rewrite");
    expect(req.currentOutput).toBe(sampleOutput);
    expect(req.action.id).toBe("softer");
    expect(req.action.instruction).toContain("Soften");
  });

  it("sets action to null for unknown action id", () => {
    const req = buildRewriteContentRequest(sampleInput, sampleOutput, "unknown", null);
    expect(req.action).toBeNull();
  });
});

describe("normalizeGenerateContentResponse", () => {
  it("extracts output from nested response", () => {
    const response = { output: { hook: "H", caption: "C", cta: "A", hashtags: [], visual: "V" } };
    const result = normalizeGenerateContentResponse(response);
    expect(result.hook).toBe("H");
    expect(result.caption).toBe("C");
  });

  it("extracts output from flat response", () => {
    const response = { hook: "H", caption: "C", cta: "A", hashtags: ["#x"], visual: "V" };
    const result = normalizeGenerateContentResponse(response);
    expect(result.hook).toBe("H");
  });

  it("throws for null response", () => {
    expect(() => normalizeGenerateContentResponse(null)).toThrow("empty or invalid");
  });

  it("throws for missing required fields", () => {
    expect(() => normalizeGenerateContentResponse({ hook: "H" })).toThrow("missing required");
  });
});

describe("applyMockToneAction", () => {
  it("applies softer tone", () => {
    const result = applyMockToneAction(sampleOutput, "softer");
    expect(result.hook).toContain("Gently remember");
  });

  it("applies stronger tone", () => {
    const result = applyMockToneAction(sampleOutput, "stronger");
    expect(result.hook).toContain("Stop waiting");
  });

  it("applies shorter tone", () => {
    const result = applyMockToneAction(sampleOutput, "shorter");
    expect(result.hook.length).toBeLessThanOrEqual(sampleOutput.hook.length + 5);
  });

  it("applies clearer tone", () => {
    const result = applyMockToneAction(sampleOutput, "clearer");
    expect(result.caption).toContain("The message:");
  });

  it("applies more_direct tone", () => {
    const result = applyMockToneAction(sampleOutput, "more_direct");
    expect(result.hook).toContain("Choose clarity");
  });

  it("returns normalized content for unknown action", () => {
    const result = applyMockToneAction(sampleOutput, "unknown");
    expect(result.hook).toBe(sampleOutput.hook);
  });

  it("covers all defined tone actions", () => {
    for (const action of AI_TONE_ACTIONS) {
      const result = applyMockToneAction(sampleOutput, action.id);
      expect(result).toHaveProperty("hook");
      expect(result).toHaveProperty("caption");
    }
  });
});
