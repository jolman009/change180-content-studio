import { normalizeGeneratedContent } from "./contentDraft";

export const AI_TONE_ACTIONS = [
  { id: "softer", label: "Softer", instruction: "Soften the tone without losing clarity." },
  { id: "stronger", label: "Stronger", instruction: "Make the message more assertive and conviction-led." },
  { id: "clearer", label: "Clearer", instruction: "Clarify the message and remove ambiguity." },
  { id: "shorter", label: "Shorter", instruction: "Make the copy more concise while preserving the core message." },
  { id: "more_direct", label: "More Direct", instruction: "Make the tone more direct and action-oriented." },
];

function summarizeBrandProfile(brandProfile) {
  if (!brandProfile) {
    return null;
  }

  return {
    brandName: brandProfile.brand_name,
    audience: brandProfile.target_audience,
    mission: brandProfile.mission,
    toneRules: brandProfile.tone_rules,
    preferredCtas: brandProfile.preferred_ctas,
    bannedPhrases: brandProfile.banned_phrases,
  };
}

export function buildGenerateContentRequest(input, brandProfile) {
  return {
    mode: "generate",
    input,
    brandProfile: summarizeBrandProfile(brandProfile),
  };
}

export function buildRewriteContentRequest(input, output, actionId, brandProfile) {
  const action = AI_TONE_ACTIONS.find((item) => item.id === actionId);

  return {
    mode: "rewrite",
    input,
    currentOutput: output,
    action: action
      ? {
          id: action.id,
          instruction: action.instruction,
        }
      : null,
    brandProfile: summarizeBrandProfile(brandProfile),
  };
}

export function normalizeGenerateContentResponse(response) {
  const output = response?.output ?? response;

  if (!output || typeof output !== "object") {
    throw new Error("AI response was empty or invalid.");
  }

  const required = ["hook", "caption", "cta"];
  const missing = required.filter((field) => !output[field] || typeof output[field] !== "string");

  if (missing.length > 0) {
    throw new Error(`AI response missing required fields: ${missing.join(", ")}`);
  }

  return normalizeGeneratedContent(output);
}

function shortenSentence(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function applyMockToneAction(output, actionId) {
  const normalized = normalizeGeneratedContent(output);

  switch (actionId) {
    case "softer":
      return {
        ...normalized,
        hook: `Gently remember: ${normalized.hook.charAt(0).toLowerCase()}${normalized.hook.slice(1)}`,
        cta: `If this resonates, ${normalized.cta.charAt(0).toLowerCase()}${normalized.cta.slice(1)}`,
      };
    case "stronger":
      return {
        ...normalized,
        hook: `Stop waiting. ${normalized.hook}`,
        cta: `Take the step now. ${normalized.cta}`,
      };
    case "clearer":
      return {
        ...normalized,
        caption: `${shortenSentence(normalized.caption, 220)}\n\nThe message: choose one honest action and follow through.`,
      };
    case "shorter":
      return {
        ...normalized,
        hook: shortenSentence(normalized.hook, 70),
        caption: shortenSentence(normalized.caption, 180),
        cta: shortenSentence(normalized.cta, 90),
      };
    case "more_direct":
      return {
        ...normalized,
        hook: `Choose clarity today. ${normalized.hook}`,
        caption: `${normalized.caption}\n\nDecide what changes now and act on it.`,
      };
    default:
      return normalized;
  }
}
