import {
  CONTENT_PILLARS,
  CONTENT_TYPES,
  PLATFORM_GOALS,
  PLATFORM_TONES,
  PLATFORMS,
  POST_STATUSES,
} from "./constants";

export const mockBrandProfile = {
  brand_name: "Change180",
  target_audience: "Adults seeking clarity, growth, and life direction",
  mission:
    "Help people renew mindset, gain clarity, and take practical steps toward lasting change.",
  tone_rules: "Grounded, hopeful, direct, reflective, practical. Avoid fluff and hype.",
  preferred_ctas:
    "Book a session, reflect on this, save this post, share with someone who needs it.",
  banned_phrases: "Boss babe, hustle harder, healing vibes only, manifest it all",
};

export const mockContentForm = {
  topic: "",
  platform: PLATFORMS[0],
  contentType: CONTENT_TYPES[0],
  pillar: CONTENT_PILLARS[0],
  goal: PLATFORM_GOALS[0],
  tone: PLATFORM_TONES[0],
  context: "",
};

export const mockGeneratedContent = {
  hook: "You do not need a new life overnight. You need one honest step today.",
  caption:
    "Growth is rarely loud. Sometimes it looks like a hard conversation, a boundary kept, or a quiet choice to stop betraying yourself. Change begins when clarity becomes action.\n\nIf this is your season to reset, do not wait for perfect conditions. Start with truth. Start with one turn in the right direction.",
  cta: "Save this for the day you need a reset, and message Change180 if you're ready for guided growth.",
  hashtags: [
    "#Change180",
    "#MindsetShift",
    "#LifeCoaching",
    "#PersonalGrowth",
    "#HealingJourney",
  ],
  visual:
    "Clean branded quote graphic with soft cream background, teal headline, and warm accent line.",
};

export const mockDashboardStats = [
  { label: "Draft Posts", value: "12" },
  { label: "Approved", value: "5" },
  { label: "Scheduled", value: "8" },
  { label: "Posted This Month", value: "21" },
];

export const mockSuggestedNextMoves = [
  "Build 3 mindset posts for next week.",
  "Create one carousel promoting coaching intake.",
  "Repurpose your strongest reflection into a reel script.",
];

export const mockRecentDrafts = [
  "When progress feels slow, keep walking. - Instagram Caption",
  "5 signs you need clarity, not more pressure. - Carousel",
  "Self-sabotage does not always look loud. - Facebook Post",
];

export const mockCalendarPosts = [
  { date: "Mon", title: "Mindset shift caption", status: POST_STATUSES[0] },
  { date: "Tue", title: "Coaching invitation carousel", status: POST_STATUSES[1] },
  { date: "Wed", title: "Reel script on self-sabotage", status: POST_STATUSES[2] },
  { date: "Thu", title: "Quote graphic", status: POST_STATUSES[0] },
  { date: "Fri", title: "Weekly reflection post", status: POST_STATUSES[2] },
];
