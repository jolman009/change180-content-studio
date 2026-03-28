import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateOAuthState } from "../linkedinOAuth";
import { validateMetaOAuthState, getOAuthPlatform } from "../metaOAuth";

describe("linkedinOAuth", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("validateOAuthState", () => {
    it("returns true when state matches stored value", () => {
      sessionStorage.setItem("change180.linkedinOAuthState", "test-state");
      expect(validateOAuthState("test-state")).toBe(true);
    });

    it("returns false when state does not match", () => {
      sessionStorage.setItem("change180.linkedinOAuthState", "stored");
      expect(validateOAuthState("different")).toBe(false);
    });

    it("returns false when no stored state", () => {
      expect(validateOAuthState("any")).toBe(false);
    });

    it("removes stored state after validation", () => {
      sessionStorage.setItem("change180.linkedinOAuthState", "once");
      validateOAuthState("once");
      expect(sessionStorage.getItem("change180.linkedinOAuthState")).toBeNull();
    });
  });
});

describe("metaOAuth", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("validateMetaOAuthState", () => {
    it("returns true when state matches", () => {
      sessionStorage.setItem("change180.metaOAuthState", "meta-state");
      expect(validateMetaOAuthState("meta-state")).toBe(true);
    });

    it("returns false when state does not match", () => {
      sessionStorage.setItem("change180.metaOAuthState", "stored");
      expect(validateMetaOAuthState("wrong")).toBe(false);
    });

    it("clears state after validation", () => {
      sessionStorage.setItem("change180.metaOAuthState", "clear-me");
      validateMetaOAuthState("clear-me");
      expect(sessionStorage.getItem("change180.metaOAuthState")).toBeNull();
    });
  });

  describe("getOAuthPlatform", () => {
    it("returns stored platform and clears it", () => {
      sessionStorage.setItem("change180.metaOAuthPlatform", "Facebook");
      expect(getOAuthPlatform()).toBe("Facebook");
      expect(sessionStorage.getItem("change180.metaOAuthPlatform")).toBeNull();
    });

    it("returns null when no platform stored", () => {
      expect(getOAuthPlatform()).toBeNull();
    });
  });
});
