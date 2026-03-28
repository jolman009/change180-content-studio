import { describe, expect, it } from "vitest";
import {
  normalizeBrandProfile,
  validateBrandProfile,
  toBrandProfileRecord,
  fromBrandProfileRecord,
  BRAND_PROFILE_FIELDS,
  REQUIRED_BRAND_PROFILE_FIELDS,
} from "../brandProfile";

describe("normalizeBrandProfile", () => {
  it("returns defaults when called with empty object", () => {
    const result = normalizeBrandProfile({});
    for (const field of BRAND_PROFILE_FIELDS) {
      expect(typeof result[field]).toBe("string");
    }
  });

  it("preserves valid input values", () => {
    const input = {
      brand_name: "Change180",
      target_audience: "Adults 30-55",
      mission: "Help people reset",
      tone_rules: "Be direct",
      preferred_ctas: "Book a call",
      banned_phrases: "Just be positive",
    };
    const result = normalizeBrandProfile(input);
    expect(result.brand_name).toBe("Change180");
    expect(result.target_audience).toBe("Adults 30-55");
    expect(result.banned_phrases).toBe("Just be positive");
  });

  it("replaces non-string values with defaults", () => {
    const result = normalizeBrandProfile({ brand_name: 123, mission: null });
    expect(typeof result.brand_name).toBe("string");
    expect(typeof result.mission).toBe("string");
  });
});

describe("validateBrandProfile", () => {
  it("returns errors for all empty required fields", () => {
    const empty = BRAND_PROFILE_FIELDS.reduce((acc, f) => ({ ...acc, [f]: "" }), {});
    const errors = validateBrandProfile(empty);
    for (const field of REQUIRED_BRAND_PROFILE_FIELDS) {
      expect(errors).toHaveProperty(field);
    }
  });

  it("returns no errors when all required fields are filled", () => {
    const valid = {
      brand_name: "Change180",
      target_audience: "Adults",
      mission: "Help people",
      tone_rules: "Direct",
      preferred_ctas: "Book a call",
      banned_phrases: "",
    };
    const errors = validateBrandProfile(valid);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("does not require banned_phrases", () => {
    const partial = {
      brand_name: "X",
      target_audience: "Y",
      mission: "Z",
      tone_rules: "A",
      preferred_ctas: "B",
      banned_phrases: "",
    };
    const errors = validateBrandProfile(partial);
    expect(errors).not.toHaveProperty("banned_phrases");
  });
});

describe("toBrandProfileRecord / fromBrandProfileRecord", () => {
  it("round-trips through record format", () => {
    const profile = {
      brand_name: "TestBrand",
      target_audience: "Testers",
      mission: "Test all things",
      tone_rules: "Be thorough",
      preferred_ctas: "Run tests",
      banned_phrases: "Skip tests",
    };
    const record = toBrandProfileRecord(profile);
    const restored = fromBrandProfileRecord(record);
    expect(restored).toEqual(profile);
  });
});
