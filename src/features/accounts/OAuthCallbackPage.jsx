import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateOAuthState, getOAuthRedirectUri } from "../../lib/linkedinOAuth";
import { validateMetaOAuthState, getOAuthPlatform, getOAuthRedirectUri as getMetaRedirectUri } from "../../lib/metaOAuth";
import { validateXOAuthState, getCodeVerifier, getOAuthRedirectUri as getXRedirectUri } from "../../lib/xOAuth";
import { apiPost } from "../../lib/api";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function exchangeCode() {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      if (!code || !state) {
        setError("Missing authorization code or state parameter.");
        return;
      }

      // Detect platform from sessionStorage
      const metaPlatform = getOAuthPlatform();
      const isMeta = metaPlatform === "Facebook" || metaPlatform === "Instagram";

      if (isMeta) {
        if (!validateMetaOAuthState(state)) {
          setError("Invalid OAuth state. Please try connecting again.");
          return;
        }

        try {
          const result = await apiPost("/meta-oauth", {
            code,
            redirectUri: getMetaRedirectUri(),
          });

          let message = `Facebook connected as ${result.facebook.platformUsername}.`;
          if (result.instagram) {
            message += ` Instagram also connected as ${result.instagram.platformUsername}.`;
          }

          navigate("/accounts", {
            state: { status: { type: "success", message } },
            replace: true,
          });
        } catch (err) {
          setError(err.message || "Failed to exchange authorization code.");
        }
        return;
      }

      // Check for X OAuth
      const xCodeVerifier = getCodeVerifier();
      if (xCodeVerifier) {
        if (!validateXOAuthState(state)) {
          setError("Invalid OAuth state. Please try connecting again.");
          return;
        }

        try {
          const result = await apiPost("/x-oauth", {
            code,
            redirectUri: getXRedirectUri(),
            codeVerifier: xCodeVerifier,
          });

          navigate("/accounts", {
            state: {
              status: {
                type: "success",
                message: `X connected as @${result.platformUsername}.`,
              },
            },
            replace: true,
          });
        } catch (err) {
          setError(err.message || "Failed to exchange X authorization code.");
        }
        return;
      }

      // Default: LinkedIn
      if (!validateOAuthState(state)) {
        setError("Invalid OAuth state. Please try connecting again.");
        return;
      }

      try {
        const result = await apiPost("/linkedin-oauth", {
          code,
          redirectUri: getOAuthRedirectUri(),
        });

        navigate("/accounts", {
          state: {
            status: {
              type: "success",
              message: `LinkedIn connected as ${result.platformUsername}.`,
            },
          },
          replace: true,
        });
      } catch (err) {
        setError(err.message || "Failed to exchange authorization code.");
      }
    }

    exchangeCode();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold text-red-800">
            Connection Failed
          </h2>
          <p className="mb-4 text-sm text-red-700">{error}</p>
          <a
            href="/accounts"
            className="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to Accounts
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <p className="text-sm text-gray-600">Connecting your account...</p>
      </div>
    </div>
  );
}
