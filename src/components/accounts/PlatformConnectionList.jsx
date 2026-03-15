import { PLATFORMS } from "../../lib/constants";
import Button from "../ui/Button";

export default function PlatformConnectionList({
  connectedPlatforms = [],
  onConnect,
  onDisconnect,
  disconnectingPlatform,
}) {
  function getCredential(platform) {
    return connectedPlatforms.find((c) => c.platform === platform);
  }

  return (
    <div className="space-y-3">
      {PLATFORMS.map((platform) => {
        const credential = getCredential(platform);

        return (
          <div
            key={platform}
            className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)]">{platform}</p>
              {credential ? (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-700">Connected</span>
                  {credential.platformUsername ? (
                    <span className="text-gray-500">@{credential.platformUsername}</span>
                  ) : null}
                  {credential.connectedAt ? (
                    <span className="text-gray-400">
                      &middot;{" "}
                      {new Date(credential.connectedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  ) : null}
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-400">Not connected</p>
              )}
            </div>

            <div className="flex-shrink-0">
              {credential ? (
                <Button
                  variant="ghost"
                  onClick={() => onDisconnect(platform)}
                  disabled={disconnectingPlatform === platform}
                  className="w-full text-sm sm:w-auto"
                >
                  {disconnectingPlatform === platform ? "Disconnecting..." : "Disconnect"}
                </Button>
              ) : (
                <Button
                  onClick={() => onConnect(platform)}
                  className="w-full text-sm sm:w-auto"
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
