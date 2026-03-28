import { describe, expect, it } from "vitest";
import {
  applyContentFilters,
  buildDashboardStats,
  buildSuggestedNextMoves,
  buildRecentDrafts,
  buildCalendarGroups,
  formatCalendarDate,
} from "../contentPipeline";

const makePosts = (overrides = []) =>
  overrides.map((o, i) => ({
    id: `post-${i}`,
    topic: `Topic ${i}`,
    hook: `Hook ${i}`,
    body: `Body ${i}`,
    cta: `CTA ${i}`,
    contentType: "Caption Post",
    platform: "Instagram",
    pillar: "Mindset",
    goal: "Engagement",
    tone: "Direct",
    status: "draft",
    scheduledFor: "",
    createdAt: new Date(2026, 2, 15 + i).toISOString(),
    ...o,
  }));

describe("applyContentFilters", () => {
  const posts = makePosts([
    { platform: "Instagram", pillar: "Mindset", status: "draft" },
    { platform: "LinkedIn", pillar: "Action", status: "approved" },
    { platform: "Facebook", pillar: "Identity", status: "posted" },
  ]);

  it("returns all posts when no filters set", () => {
    const result = applyContentFilters(posts, { q: "", platform: "", pillar: "", status: "" });
    expect(result).toHaveLength(3);
  });

  it("filters by platform", () => {
    const result = applyContentFilters(posts, { q: "", platform: "LinkedIn", pillar: "", status: "" });
    expect(result).toHaveLength(1);
    expect(result[0].platform).toBe("LinkedIn");
  });

  it("filters by pillar", () => {
    const result = applyContentFilters(posts, { q: "", platform: "", pillar: "Identity", status: "" });
    expect(result).toHaveLength(1);
    expect(result[0].pillar).toBe("Identity");
  });

  it("filters by status", () => {
    const result = applyContentFilters(posts, { q: "", platform: "", pillar: "", status: "approved" });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("approved");
  });

  it("filters by search query across fields", () => {
    const result = applyContentFilters(posts, { q: "Topic 0", platform: "", pillar: "", status: "" });
    expect(result).toHaveLength(1);
  });

  it("search is case-insensitive", () => {
    const result = applyContentFilters(posts, { q: "TOPIC 1", platform: "", pillar: "", status: "" });
    expect(result).toHaveLength(1);
  });

  it("combines filters", () => {
    const result = applyContentFilters(posts, { q: "", platform: "Instagram", pillar: "Mindset", status: "draft" });
    expect(result).toHaveLength(1);
  });
});

describe("buildDashboardStats", () => {
  it("counts posts by status", () => {
    const posts = makePosts([
      { status: "draft" },
      { status: "draft" },
      { status: "approved" },
      { status: "scheduled" },
      { status: "posted", createdAt: new Date().toISOString() },
    ]);
    const stats = buildDashboardStats(posts);
    const statMap = Object.fromEntries(stats.map((s) => [s.label, s.value]));
    expect(statMap["Draft Posts"]).toBe("2");
    expect(statMap["Approved"]).toBe("1");
    expect(statMap["Scheduled"]).toBe("1");
    expect(statMap["Posted This Month"]).toBe("1");
  });

  it("returns zeros for empty posts", () => {
    const stats = buildDashboardStats([]);
    expect(stats.every((s) => s.value === "0")).toBe(true);
  });
});

describe("buildSuggestedNextMoves", () => {
  it("suggests filling missing pillars", () => {
    const posts = makePosts([{ pillar: "Mindset" }]);
    const suggestions = buildSuggestedNextMoves(posts);
    expect(suggestions.some((s) => s.includes("pillar gap"))).toBe(true);
  });

  it("suggests scheduling approved posts without dates", () => {
    const posts = makePosts([{ status: "approved", scheduledFor: "" }]);
    const suggestions = buildSuggestedNextMoves(posts);
    expect(suggestions.some((s) => s.includes("Schedule"))).toBe(true);
  });

  it("suggests reel script when none exist", () => {
    const posts = makePosts([{ contentType: "Caption Post" }]);
    const suggestions = buildSuggestedNextMoves(posts);
    expect(suggestions.some((s) => s.includes("reel script"))).toBe(true);
  });
});

describe("buildRecentDrafts", () => {
  it("returns the 3 most recent posts", () => {
    const posts = makePosts([{}, {}, {}, {}, {}]);
    const recent = buildRecentDrafts(posts);
    expect(recent).toHaveLength(3);
  });

  it("sorts by createdAt descending", () => {
    const posts = makePosts([
      { createdAt: "2026-01-01T00:00:00Z" },
      { createdAt: "2026-03-01T00:00:00Z" },
      { createdAt: "2026-02-01T00:00:00Z" },
    ]);
    const recent = buildRecentDrafts(posts);
    expect(new Date(recent[0].createdAt) >= new Date(recent[1].createdAt)).toBe(true);
  });
});

describe("buildCalendarGroups", () => {
  it("groups posts by scheduledFor date", () => {
    const posts = makePosts([
      { scheduledFor: "2026-04-01" },
      { scheduledFor: "2026-04-01" },
      { scheduledFor: "2026-04-03" },
    ]);
    const groups = buildCalendarGroups(posts);
    expect(groups).toHaveLength(2);
    expect(groups[0].items).toHaveLength(2);
  });

  it("puts unscheduled posts last", () => {
    const posts = makePosts([
      { scheduledFor: "" },
      { scheduledFor: "2026-04-01" },
    ]);
    const groups = buildCalendarGroups(posts);
    expect(groups[groups.length - 1].date).toBe("Unscheduled");
  });

  it("sorts date groups chronologically", () => {
    const posts = makePosts([
      { scheduledFor: "2026-04-05" },
      { scheduledFor: "2026-04-01" },
    ]);
    const groups = buildCalendarGroups(posts);
    expect(groups[0].date).toBe("2026-04-01");
    expect(groups[1].date).toBe("2026-04-05");
  });
});

describe("formatCalendarDate", () => {
  it("formats a date string to a short label", () => {
    const label = formatCalendarDate("2026-04-01");
    expect(label).toContain("Apr");
    expect(label).toContain("1");
  });
});
