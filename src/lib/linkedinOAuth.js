const LINKEDIN_SCOPES = "openid profile w_member_social";
const STATE_KEY = "change180.linkedinOAuthState";

export function getOAuthRedirectUri() {
  return `${window.location.origin}/accounts/callback`;
}

export function buildLinkedInAuthUrl() {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;

  if (!clientId) {
    throw new Error("VITE_LINKEDIN_CLIENT_ID is not configured.");
  }

  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: getOAuthRedirectUri(),
    scope: LINKEDIN_SCOPES,
    state,
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

export function validateOAuthState(state) {
  const stored = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);

  if (!stored || stored !== state) {
    return false;
  }

  return true;
}
