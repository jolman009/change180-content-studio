import { mockBrandProfile } from "./mockData";

export const BRAND_PROFILE_FIELDS = [
  "brand_name",
  "target_audience",
  "mission",
  "tone_rules",
  "preferred_ctas",
  "banned_phrases",
];

export const REQUIRED_BRAND_PROFILE_FIELDS = [
  "brand_name",
  "target_audience",
  "mission",
  "tone_rules",
  "preferred_ctas",
];

export const BRAND_PROFILE_LABELS = {
  brand_name: "Brand Name",
  target_audience: "Target Audience",
  mission: "Mission",
  tone_rules: "Tone Rules",
  preferred_ctas: "Preferred Calls to Action",
  banned_phrases: "Phrases to Avoid",
};

export function createBrandProfile() {
  return normalizeBrandProfile(mockBrandProfile);
}

export function normalizeBrandProfile(profile = {}) {
  return BRAND_PROFILE_FIELDS.reduce((normalized, field) => {
    normalized[field] = typeof profile[field] === "string" ? profile[field] : mockBrandProfile[field];
    return normalized;
  }, {});
}

export function fromBrandProfileRecord(record) {
  return normalizeBrandProfile(record);
}

export function toBrandProfileRecord(profile) {
  const normalizedProfile = normalizeBrandProfile(profile);

  return {
    brand_name: normalizedProfile.brand_name,
    target_audience: normalizedProfile.target_audience,
    mission: normalizedProfile.mission,
    tone_rules: normalizedProfile.tone_rules,
    preferred_ctas: normalizedProfile.preferred_ctas,
    banned_phrases: normalizedProfile.banned_phrases,
  };
}

export function validateBrandProfile(profile) {
  return REQUIRED_BRAND_PROFILE_FIELDS.reduce((errors, field) => {
    if (!profile[field]?.trim()) {
      errors[field] = `${BRAND_PROFILE_LABELS[field]} is required.`;
    }

    return errors;
  }, {});
}
