export const weeklyMessageArc = [
  {
    id: "structure",
    label: "Week 1",
    title: "Structure",
    summary: "Anchor the audience in a simple plan instead of generic motivation.",
    focus: "Show how structure turns intention into a repeatable weekly rhythm.",
    bestFormats: ["Carousel", "Caption Post", "Reel Script"],
    cta: "Comment or DM for a next-step prompt.",
  },
  {
    id: "goals",
    label: "Week 2",
    title: "Goals",
    summary: "Translate broad goals into one priority, one habit, and one check-in.",
    focus: "Keep the promise measurable and clear without making claims the site cannot support.",
    bestFormats: ["Carousel", "Quote Post", "Reel Script"],
    cta: "Invite the audience to simplify a current goal.",
  },
  {
    id: "habits",
    label: "Week 3",
    title: "Habits",
    summary: "Make progress feel practical by shrinking habits until they are easy to repeat.",
    focus: "Reinforce consistency over intensity and small steps over heroic effort.",
    bestFormats: ["Carousel", "Reel Script", "Quote Post"],
    cta: "Offer a tiny-habit or reset prompt through DM.",
  },
  {
    id: "momentum",
    label: "Week 4",
    title: "Momentum",
    summary: "Move people from examples and explanation into a real next step with Change180.",
    focus: "Use structured support, accountability, and discovery prompts to drive inquiry.",
    bestFormats: ["Carousel", "Caption Post", "Reel Script"],
    cta: "Push to website visit, DM start, or inquiry conversation.",
  },
];

export const weekdayCadence = [
  {
    day: "Monday",
    format: "Carousel",
    purpose: "Teach a framework or checklist people can save and revisit.",
    idealKpi: "Saves and comment keywords",
    sectionId: "cadence",
  },
  {
    day: "Tuesday",
    format: "Reel Script",
    purpose: "Deliver one direct coaching move in 30-60 seconds.",
    idealKpi: "DM keywords and profile interest",
    sectionId: "cadence",
  },
  {
    day: "Wednesday",
    format: "Quote Post",
    purpose: "Reinforce identity and motivation using the same brand language.",
    idealKpi: "Shares and supportive comments",
    sectionId: "cadence",
  },
  {
    day: "Thursday",
    format: "Caption Post",
    purpose: "Add perspective, pain-point framing, and a soft invitation to engage.",
    idealKpi: "Qualified DMs started",
    sectionId: "cadence",
  },
  {
    day: "Friday",
    format: "Reel Script or Carousel",
    purpose: "Run the strongest call to action of the week and push to inquiry.",
    idealKpi: "Website clicks, DMs, discovery conversations",
    sectionId: "cadence",
  },
];

export const ctaLadder = [
  {
    title: "Engagement CTA",
    description: "Save, share, or comment on a keyword before asking for a bigger commitment.",
    examples: ["Save this for your weekly reset.", "Comment 'START' for the next-step prompt."],
  },
  {
    title: "Conversation CTA",
    description: "Move warm viewers into private DM prompts with one keyword and one promise.",
    examples: ["DM 'PLAN' for the starting framework.", "DM 'RESET' for a smaller habit version."],
  },
  {
    title: "Conversion CTA",
    description: "Use the website or discovery conversation ask when the post has already built clarity.",
    examples: ["Visit change180.org to start.", "Book the conversation after the Friday CTA post."],
  },
];

export const kpiLoop = [
  {
    title: "Attention",
    items: ["Reach", "Profile visits", "Saves", "Shares"],
  },
  {
    title: "Lead Actions",
    items: ["DM keyword count", "Comment keyword count", "Website clicks"],
  },
  {
    title: "Sales Outcomes",
    items: ["Qualified conversations", "Discovery calls held", "New clients acquired"],
  },
];

export const productionChecklist = [
  "Confirm one weekly theme and one primary conversion action before writing.",
  "Batch Monday-Friday posts in one session so execution stays structured.",
  "Prepare saved replies for every CTA keyword before publishing.",
  "Reuse one quote template and one carousel template across the month.",
  "Add alt text and a visible on-screen CTA before the post goes live.",
];

export const repurposingPlan = [
  "Turn one carousel into a quote post, a short voiceover reel, and a story sequence.",
  "Turn one short video hook into next week's caption-only post.",
  "Cross-post the same core content to Instagram, Facebook, and LinkedIn with tone edits instead of rewriting from scratch.",
];

export const infrastructureNotes = [
  {
    title: "Structured outputs by default",
    description:
      "Keep generation and rewrite responses schema-bound so content planning, KPI tags, and CTA types stay machine-readable.",
  },
  {
    title: "Prompt layers, not one giant prompt",
    description:
      "Split brand profile, campaign playbook, and per-post request into reusable layers so weekly generation is easier to maintain.",
  },
  {
    title: "Asynchronous batch work",
    description:
      "Use background or batch generation for weekly packs instead of making every idea creation a blocking UI request.",
  },
  {
    title: "Track operational metrics with content metrics",
    description:
      "Measure latency, retries, fallback rate, and cost next to saves, DMs, and inquiries so infrastructure quality is visible.",
  },
];

export function getSuggestedMoveDestination(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("pillar gap")) {
    return "/next-moves#weekly-arc";
  }

  if (normalized.includes("schedule")) {
    return "/next-moves#cta-kpi";
  }

  if (normalized.includes("reel script")) {
    return "/next-moves#cadence";
  }

  return "/next-moves";
}
