import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock runtime to force localStorage fallback path
vi.mock("../../lib/runtime", () => ({
  hasSupabaseEnv: false,
  hasApiBaseUrl: false,
  runtimeMode: "mock",
}));

vi.mock("../../lib/supabaseClient", () => ({
  supabase: null,
}));

const { saveContentPost, updateContentPost, getContentPosts, getContentPostById } = await import(
  "../contentService"
);

const STORAGE_KEY = "change180.contentPosts";

function makeDraft(overrides = {}) {
  return {
    topic: "Test topic",
    platform: "Instagram",
    contentType: "Caption Post",
    pillar: "Mindset",
    goal: "Engagement",
    tone: "Grounded, hopeful, direct",
    context: "",
    status: "draft",
    scheduledFor: "",
    hook: "Test hook",
    body: "Test body",
    cta: "Test CTA",
    hashtags: ["#test"],
    visualDirection: "Photo",
    ...overrides,
  };
}

describe("contentService (localStorage fallback)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("saveContentPost", () => {
    it("saves a post to localStorage and returns it", async () => {
      const result = await saveContentPost(makeDraft());
      expect(result.source).toBe("local");
      expect(result.data).toHaveProperty("id");
      expect(result.data.topic).toBe("Test topic");
      expect(result.data.hook).toBe("Test hook");
    });

    it("generates an id for new posts", async () => {
      const result = await saveContentPost(makeDraft());
      expect(result.data.id).toMatch(/^local-/);
    });

    it("persists to localStorage", async () => {
      await saveContentPost(makeDraft());
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(1);
    });
  });

  describe("getContentPosts", () => {
    it("returns seeded demo data when localStorage is empty", async () => {
      const result = await getContentPosts();
      expect(result.source).toBe("local");
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("returns saved posts when they exist", async () => {
      await saveContentPost(makeDraft({ topic: "Custom" }));
      const result = await getContentPosts();
      expect(result.data.some((p) => p.topic === "Custom")).toBe(true);
    });
  });

  describe("updateContentPost", () => {
    it("updates an existing post", async () => {
      const saved = await saveContentPost(makeDraft());
      const updated = await updateContentPost(saved.data.id, { status: "approved" });
      expect(updated.data.status).toBe("approved");
      expect(updated.data.id).toBe(saved.data.id);
    });

    it("throws when post not found", async () => {
      await saveContentPost(makeDraft());
      await expect(updateContentPost("nonexistent-id", { status: "approved" })).rejects.toThrow(
        "not found"
      );
    });
  });

  describe("getContentPostById", () => {
    it("returns a specific post by id", async () => {
      const saved = await saveContentPost(makeDraft({ topic: "Find me" }));
      const result = await getContentPostById(saved.data.id);
      expect(result.data.topic).toBe("Find me");
    });

    it("throws when post not found", async () => {
      await expect(getContentPostById("missing-id")).rejects.toThrow("not found");
    });
  });
});
