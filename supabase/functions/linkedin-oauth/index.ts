import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

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

  // Verify JWT
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ message: "Missing authorization token." }, 401);
  }

  const jwt = authHeader.replace("Bearer ", "");

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const clientId = Deno.env.get("LINKEDIN_CLIENT_ID");
    const clientSecret = Deno.env.get("LINKEDIN_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return jsonResponse(
        { message: "LinkedIn OAuth is not configured on the server." },
        500,
      );
    }

    // Verify the user's JWT and get user ID
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(jwt);

    if (authError || !user) {
      return jsonResponse({ message: "Invalid or expired token." }, 401);
    }

    const { code, redirectUri } = await request.json();

    if (!code || !redirectUri) {
      return jsonResponse(
        { message: "Missing code or redirectUri." },
        400,
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return jsonResponse(
        {
          message:
            tokenData.error_description ||
            tokenData.error ||
            "Failed to exchange authorization code.",
        },
        400,
      );
    }

    const accessToken = tokenData.access_token as string;
    const expiresIn = (tokenData.expires_in as number) || 5184000; // default 60 days

    // Fetch LinkedIn user info
    const userinfoResponse = await fetch(LINKEDIN_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userinfo = await userinfoResponse.json();

    if (!userinfoResponse.ok || !userinfo.sub) {
      return jsonResponse(
        { message: "Failed to retrieve LinkedIn user info." },
        400,
      );
    }

    const platformUserId = userinfo.sub as string;
    const platformUsername = (userinfo.name as string) || platformUserId;
    const tokenExpiresAt = new Date(
      Date.now() + expiresIn * 1000,
    ).toISOString();

    // Upsert credential
    const { error: upsertError } = await supabaseAdmin
      .from("platform_credentials")
      .upsert(
        {
          user_id: user.id,
          platform: "LinkedIn",
          access_token: accessToken,
          refresh_token: null,
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
        { message: "Failed to save LinkedIn credential." },
        500,
      );
    }

    return jsonResponse({ success: true, platformUsername });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error during LinkedIn OAuth.";
    return jsonResponse({ message }, 500);
  }
});
