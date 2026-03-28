import { corsHeaders } from "../_shared/cors.ts";
import { validateOAuthBody } from "../_shared/validation.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const X_TOKEN_URL = "https://api.x.com/2/oauth2/token";
const X_USERINFO_URL = "https://api.x.com/2/users/me";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed." }, 405);
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ message: "Missing authorization token." }, 401);
  }

  const jwt = authHeader.replace("Bearer ", "");

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const clientId = Deno.env.get("X_CLIENT_ID");
    const clientSecret = Deno.env.get("X_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return jsonResponse(
        { message: "X OAuth is not configured on the server." },
        500,
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(jwt);

    if (authError || !user) {
      return jsonResponse({ message: "Invalid or expired token." }, 401);
    }

    const requestBody = await request.json();
    const oauthErrors = validateOAuthBody(requestBody as Record<string, unknown>);
    if (oauthErrors.length > 0) {
      return jsonResponse({ message: oauthErrors.join(" ") }, 400);
    }

    const { code, redirectUri, codeVerifier } = requestBody;

    // Exchange authorization code for access token (PKCE flow)
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const tokenResponse = await fetch(X_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier || "challenge",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return jsonResponse(
        {
          message:
            tokenData.error_description ||
            tokenData.error ||
            "Failed to exchange X authorization code.",
        },
        400,
      );
    }

    const accessToken = tokenData.access_token as string;
    const refreshToken = (tokenData.refresh_token as string) || null;
    const expiresIn = (tokenData.expires_in as number) || 7200; // default 2 hours

    // Fetch user info
    const userinfoResponse = await fetch(X_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userinfo = await userinfoResponse.json();

    if (!userinfoResponse.ok || !userinfo.data?.id) {
      return jsonResponse(
        { message: "Failed to retrieve X user info." },
        400,
      );
    }

    const platformUserId = userinfo.data.id as string;
    const platformUsername = (userinfo.data.username as string) || platformUserId;
    const tokenExpiresAt = new Date(
      Date.now() + expiresIn * 1000,
    ).toISOString();

    // Upsert credential
    const { error: upsertError } = await supabaseAdmin
      .from("platform_credentials")
      .upsert(
        {
          user_id: user.id,
          platform: "X",
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: tokenExpiresAt,
          platform_user_id: platformUserId,
          platform_username: platformUsername,
          connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,platform" },
      );

    if (upsertError) {
      return jsonResponse(
        { message: "Failed to save X credential." },
        500,
      );
    }

    return jsonResponse({ success: true, platformUsername });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error during X OAuth.";
    return jsonResponse({ message }, 500);
  }
});
