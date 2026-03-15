import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import PlatformConnectionList from "../../components/accounts/PlatformConnectionList";
import {
  getConnectedPlatforms,
  savePlatformCredential,
  disconnectPlatform,
} from "../../services/platformService";
import { hasSupabaseEnv } from "../../lib/runtime";

export default function ConnectedAccountsPage() {
  const [credentials, setCredentials] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState(null);

  async function loadCredentials() {
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const result = await getConnectedPlatforms();
      setCredentials(result.data);
      setStatus({
        type: "info",
        message:
          result.source === "supabase"
            ? "Loaded connected accounts from Supabase."
            : "Loaded connected accounts from local storage.",
      });
    } catch (error) {
      setCredentials([]);
      setStatus({
        type: "error",
        message: error.message || "Unable to load connected accounts.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCredentials();
  }, []);

  async function handleConnect(platform) {
    setStatus({ type: "", message: "" });

    if (hasSupabaseEnv) {
      setStatus({
        type: "info",
        message: `OAuth for ${platform} is not yet configured. Connect will be available in a future update.`,
      });
      return;
    }

    try {
      const mockCredential = {
        platform,
        accessToken: `mock-token-${platform.toLowerCase()}-${Date.now()}`,
        refreshToken: null,
        tokenExpiresAt: null,
        platformUserId: `mock-user-${platform.toLowerCase()}`,
        platformUsername: `change180_${platform.toLowerCase()}`,
      };

      await savePlatformCredential(mockCredential);
      await loadCredentials();
      setStatus({
        type: "success",
        message: `${platform} connected successfully (mock).`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || `Unable to connect ${platform}.`,
      });
    }
  }

  async function handleDisconnect(platform) {
    setDisconnectingPlatform(platform);
    setStatus({ type: "", message: "" });

    try {
      await disconnectPlatform(platform);
      await loadCredentials();
      setStatus({
        type: "success",
        message: `${platform} disconnected.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || `Unable to disconnect ${platform}.`,
      });
    } finally {
      setDisconnectingPlatform(null);
    }
  }

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Connected Accounts"
        description="Checking platform connection status."
      />
    );
  }

  if (status.type === "error" && credentials.length === 0) {
    return (
      <ErrorState
        title="Connected Accounts"
        message={status.message}
      />
    );
  }

  return (
    <Card title="Connected Accounts" subtitle="Manage your social platform connections">
      {status.message ? (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            status.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-sky-200 bg-sky-50 text-sky-700"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <PlatformConnectionList
        connectedPlatforms={credentials}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        disconnectingPlatform={disconnectingPlatform}
      />
    </Card>
  );
}
