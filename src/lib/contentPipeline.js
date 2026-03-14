import { CONTENT_PILLARS, PLATFORMS, POST_STATUSES } from "./constants";

function normalizeSearch(value = "") {
  return value.trim().toLowerCase();
}

function includesSearch(haystack, needle) {
  return haystack.toLowerCase().includes(needle);
}

export function applyContentFilters(posts, filters) {
  const searchQuery = normalizeSearch(filters.q);

  return posts.filter((post) => {
    if (filters.platform && post.platform !== filters.platform) {
      return false;
    }

    if (filters.pillar && post.pillar !== filters.pillar) {
      return false;
    }

    if (filters.status && post.status !== filters.status) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    const searchFields = [
      post.topic,
      post.hook,
      post.body,
      post.cta,
      post.contentType,
      post.platform,
      post.pillar,
    ]
      .filter(Boolean)
      .join(" ");

    return includesSearch(searchFields, searchQuery);
  });
}

export function getContentFiltersFromSearchParams(searchParams) {
  return {
    q: searchParams.get("q") ?? "",
    platform: searchParams.get("platform") ?? "",
    pillar: searchParams.get("pillar") ?? "",
    status: searchParams.get("status") ?? "",
  };
}

export function getFilterOptions() {
  return {
    platforms: PLATFORMS,
    pillars: CONTENT_PILLARS,
    statuses: POST_STATUSES,
  };
}

export function buildDashboardStats(posts) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const postedThisMonth = posts.filter((post) => {
    if (post.status !== "posted" || !post.createdAt) {
      return false;
    }

    const createdAt = new Date(post.createdAt);
    return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
  }).length;

  return [
    { label: "Draft Posts", value: String(posts.filter((post) => post.status === "draft").length) },
    { label: "Approved", value: String(posts.filter((post) => post.status === "approved").length) },
    { label: "Scheduled", value: String(posts.filter((post) => post.status === "scheduled").length) },
    { label: "Posted This Month", value: String(postedThisMonth) },
  ];
}

export function buildSuggestedNextMoves(posts) {
  const suggestions = [];
  const coveredPillars = new Set(posts.map((post) => post.pillar));
  const missingPillars = CONTENT_PILLARS.filter((pillar) => !coveredPillars.has(pillar));
  const unscheduledApprovedPosts = posts.filter(
    (post) => post.status === "approved" && !post.scheduledFor,
  ).length;

  if (missingPillars.length > 0) {
    suggestions.push(`Create a post for ${missingPillars[0]} to close a pillar gap.`);
  }

  if (unscheduledApprovedPosts > 0) {
    suggestions.push(`Schedule ${unscheduledApprovedPosts} approved post${unscheduledApprovedPosts > 1 ? "s" : ""} for this week.`);
  }

  const reelScripts = posts.filter((post) => post.contentType === "Reel Script").length;
  if (reelScripts === 0) {
    suggestions.push("Add a reel script to diversify the content mix.");
  }

  return suggestions;
}

export function buildRecentDrafts(posts) {
  return posts
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);
}

export function buildCalendarGroups(posts) {
  const groupedPosts = posts.reduce((groups, post) => {
    const groupKey = post.scheduledFor || "Unscheduled";
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(post);
    return groups;
  }, {});

  return Object.entries(groupedPosts)
    .sort(([left], [right]) => {
      if (left === "Unscheduled") return 1;
      if (right === "Unscheduled") return -1;
      return new Date(left) - new Date(right);
    })
    .map(([date, items]) => ({
      date,
      label: date === "Unscheduled" ? date : formatCalendarDate(date),
      items: items.sort((a, b) => a.platform.localeCompare(b.platform)),
    }));
}

export function formatCalendarDate(value) {
  const parsedDate = new Date(`${value}T12:00:00`);
  return parsedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
