import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateOAuthState, getOAuthRedirectUri } from "../../lib/linkedinOAuth";
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
        <p className="text-sm text-gray-600">Connecting your LinkedIn account...</p>
      </div>
    </div>
  );
}
