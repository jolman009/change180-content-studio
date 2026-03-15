import { useState } from "react";
import Button from "../ui/Button";
import { PLATFORMS } from "../../lib/constants";

export default function DuplicateToMenu({ currentPlatform, onDuplicate, disabled }) {
  const [open, setOpen] = useState(false);
  const otherPlatforms = PLATFORMS.filter((p) => p !== currentPlatform);

  if (otherPlatforms.length === 0) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        className="text-sm"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Cancel" : "Duplicate to..."}
      </Button>

      {open ? (
        <div className="mt-1 flex flex-wrap gap-2">
          {otherPlatforms.map((platform) => (
            <Button
              key={platform}
              variant="secondary"
              className="text-xs"
              disabled={disabled}
              onClick={() => {
                onDuplicate(platform);
                setOpen(false);
              }}
            >
              {platform}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
