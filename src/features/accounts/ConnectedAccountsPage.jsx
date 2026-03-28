import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
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
import { buildLinkedInAuthUrl } from "../../lib/linkedinOAuth";
import { buildMetaAuthUrl } from "../../lib/metaOAuth";

export default function ConnectedAccountsPage() {
  const location = useLocation();
  const [credentials, setCredentials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [disconnectingPlatform, setDisconnectingPlatform] = useState(null);
  const [refreshingPlatform, setRefreshingPlatform] = useState(null);

  async function loadCredentials() {
    setIsLoading(true);
    setLoadError("");

    try {
      const result = await getConnectedPlatforms();
      setCredentials(result.data);
      if (result.source !== "supabase") {
        toast.info("Loaded connected accounts from local storage.");
      }
    } catch (error) {
      setCredentials([]);
      setLoadError(error.message || "Unable to load connected accounts.");
      toast.error(error.message || "Unable to load connected accounts.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCredentials();
  }, []);

  // Check for OAuth callback status passed via navigation state
  useEffect(() => {
    if (location.state?.status) {
      const s = location.state.status;
      if (s.type === "success") {
        toast.success(s.message);
      } else if (s.type === "error") {
        toast.error(s.message);
      } else {
        toast.info(s.message);
      }
      loadCredentials();
      // Clear navigation state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  async function handleConnect(platform) {
    if (hasSupabaseEnv && platform === "LinkedIn") {
      try {
        window.location.href = buildLinkedInAuthUrl();
      } catch (error) {
        toast.error(error.message || "Unable to start LinkedIn OAuth.");
      }
      return;
    }

    if (hasSupabaseEnv && (platform === "Facebook" || platform === "Instagram")) {
      try {
        window.location.href = buildMetaAuthUrl(platform);
      } catch (error) {
        toast.error(error.message || "Unable to start Meta OAuth.");
      }
      return;
    }

    if (hasSupabaseEnv) {
      toast.info(`OAuth for ${platform} is not yet configured. Connect will be available in a future update.`);
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
      toast.success(`${platform} connected successfully (mock).`);
    } catch (error) {
      toast.error(error.message || `Unable to connect ${platform}.`);
    }
  }

  function handleRefresh(platform) {
    // Re-initiates OAuth flow to get fresh tokens
    setRefreshingPlatform(platform);
    handleConnect(platform);
  }

  async function handleDisconnect(platform) {
    setDisconnectingPlatform(platform);

    try {
      await disconnectPlatform(platform);
      await loadCredentials();
      toast.success(`${platform} disconnected.`);
    } catch (error) {
      toast.error(error.message || `Unable to disconnect ${platform}.`);
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

  if (loadError && credentials.length === 0) {
    return (
      <ErrorState
        title="Connected Accounts"
        message={loadError}
      />
    );
  }

  return (
    <Card title="Connected Accounts" subtitle="Manage your social platform connections">
      <PlatformConnectionList
        connectedPlatforms={credentials}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onRefresh={handleRefresh}
        disconnectingPlatform={disconnectingPlatform}
        refreshingPlatform={refreshingPlatform}
      />
    </Card>
  );
}
