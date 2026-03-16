import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GRAPH_BASE = "https://graph.facebook.com/v22.0";

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
    const appId = Deno.env.get("META_APP_ID");
    const appSecret = Deno.env.get("META_APP_SECRET");
    const targetPageId = Deno.env.get("FACEBOOK_PAGE_ID");

    if (!appId || !appSecret) {
      return jsonResponse(
        { message: "Meta OAuth is not configured on the server." },
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

    // Step 1: Exchange code for short-lived user access token
    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    });

    const tokenResponse = await fetch(
      `${GRAPH_BASE}/oauth/access_token?${tokenParams.toString()}`,
    );
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return jsonResponse(
        {
          message:
            tokenData.error?.message ||
            tokenData.error ||
            "Failed to exchange authorization code.",
        },
        400,
      );
    }

    // Step 2: Exchange for long-lived user access token
    const longLivedParams = new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: tokenData.access_token,
    });

    const longLivedResponse = await fetch(
      `${GRAPH_BASE}/oauth/access_token?${longLivedParams.toString()}`,
    );
    const longLivedData = await longLivedResponse.json();

    if (!longLivedResponse.ok || !longLivedData.access_token) {
      return jsonResponse(
        { message: "Failed to exchange for long-lived token." },
        400,
      );
    }

    const userAccessToken = longLivedData.access_token as string;

    // Step 3: Fetch user info
    const userResponse = await fetch(
      `${GRAPH_BASE}/me?fields=id,name&access_token=${userAccessToken}`,
    );
    const userData = await userResponse.json();

    if (!userResponse.ok || !userData.id) {
      return jsonResponse(
        { message: "Failed to retrieve Facebook user info." },
        400,
      );
    }

    // Step 4: Fetch managed pages
    const pagesResponse = await fetch(
      `${GRAPH_BASE}/me/accounts?access_token=${userAccessToken}`,
    );
    const pagesData = await pagesResponse.json();

    if (!pagesResponse.ok || !pagesData.data?.length) {
      return jsonResponse(
        { message: "No Facebook Pages found. You must be an admin of at least one Page." },
        400,
      );
    }

    // Select page by FACEBOOK_PAGE_ID or use first page
    const page = targetPageId
      ? pagesData.data.find((p: { id: string }) => p.id === targetPageId)
      : pagesData.data[0];

    if (!page) {
      return jsonResponse(
        { message: `Facebook Page ${targetPageId} not found in your managed pages.` },
        400,
      );
    }

    // Page Access Token from /me/accounts is already long-lived when user token is long-lived
    const pageAccessToken = page.access_token as string;
    const now = new Date().toISOString();

    // Upsert Facebook credential with Page Access Token
    const { error: fbUpsertError } = await supabaseAdmin
      .from("platform_credentials")
      .upsert(
        {
          user_id: user.id,
          platform: "Facebook",
          access_token: pageAccessToken,
          refresh_token: null,
          token_expires_at: null, // Page tokens don't expire when derived from long-lived user token
          platform_user_id: page.id,
          platform_username: page.name || page.id,
          connected_at: now,
          updated_at: now,
        },
        { onConflict: "user_id,platform" },
      );

    if (fbUpsertError) {
      return jsonResponse(
        { message: "Failed to save Facebook credential." },
        500,
      );
    }

    const result: {
      success: boolean;
      facebook: { platformUsername: string };
      instagram: { platformUsername: string } | null;
    } = {
      success: true,
      facebook: { platformUsername: page.name || page.id },
      instagram: null,
    };

    // Step 5: Check for linked Instagram Business Account
    const igResponse = await fetch(
      `${GRAPH_BASE}/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`,
    );
    const igData = await igResponse.json();

    if (igResponse.ok && igData.instagram_business_account?.id) {
      const igId = igData.instagram_business_account.id as string;

      // Fetch Instagram username
      const igInfoResponse = await fetch(
        `${GRAPH_BASE}/${igId}?fields=username,name&access_token=${pageAccessToken}`,
      );
      const igInfo = await igInfoResponse.json();

      const igUsername = (igInfo.username as string) || igId;

      const { error: igUpsertError } = await supabaseAdmin
        .from("platform_credentials")
        .upsert(
          {
            user_id: user.id,
            platform: "Instagram",
            access_token: pageAccessToken,
            refresh_token: null,
            token_expires_at: null,
            platform_user_id: igId,
            platform_username: igUsername,
            connected_at: now,
            updated_at: now,
          },
          { onConflict: "user_id,platform" },
        );

      if (!igUpsertError) {
        result.instagram = { platformUsername: igUsername };
      }
    }

    return jsonResponse(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error during Meta OAuth.";
    return jsonResponse({ message }, 500);
  }
});
