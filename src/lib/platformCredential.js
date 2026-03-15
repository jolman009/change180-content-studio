export const PLATFORM_CREDENTIAL_FIELDS = [
  "platform",
  "accessToken",
  "refreshToken",
  "tokenExpiresAt",
  "platformUserId",
  "platformUsername",
  "connectedAt",
  "updatedAt",
];

export function fromPlatformCredentialRecord(record = {}) {
  return {
    id: record.id ?? null,
    platform: record.platform ?? "",
    accessToken: record.access_token ?? "",
    refreshToken: record.refresh_token ?? null,
    tokenExpiresAt: record.token_expires_at ?? null,
    platformUserId: record.platform_user_id ?? null,
    platformUsername: record.platform_username ?? null,
    connectedAt: record.connected_at ?? null,
    updatedAt: record.updated_at ?? null,
  };
}

export function toPlatformCredentialRecord(credential) {
  return {
    platform: credential.platform,
    access_token: credential.accessToken,
    refresh_token: credential.refreshToken ?? null,
    token_expires_at: credential.tokenExpiresAt ?? null,
    platform_user_id: credential.platformUserId ?? null,
    platform_username: credential.platformUsername ?? null,
  };
}
