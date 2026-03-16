const META_SCOPES = "pages_manage_posts,pages_read_engagement,public_profile,instagram_basic,instagram_content_publish";
const STATE_KEY = "change180.metaOAuthState";
const PLATFORM_KEY = "change180.metaOAuthPlatform";

export function getOAuthRedirectUri() {
  return `${window.location.origin}/accounts/callback`;
}

export function buildMetaAuthUrl(platform) {
  const appId = import.meta.env.VITE_META_APP_ID;

  if (!appId) {
    throw new Error("VITE_META_APP_ID is not configured.");
  }

  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);
  sessionStorage.setItem(PLATFORM_KEY, platform);

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: getOAuthRedirectUri(),
    scope: META_SCOPES,
    response_type: "code",
    state,
  });

  return `https://www.facebook.com/v22.0/dialog/oauth?${params.toString()}`;
}

export function validateMetaOAuthState(state) {
  const stored = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);

  if (!stored || stored !== state) {
    return false;
  }

  return true;
}

export function getOAuthPlatform() {
  const platform = sessionStorage.getItem(PLATFORM_KEY);
  sessionStorage.removeItem(PLATFORM_KEY);
  return platform;
}
