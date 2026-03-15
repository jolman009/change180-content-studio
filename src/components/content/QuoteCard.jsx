import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import Button from "../ui/Button";

const CARD_STYLES = [
  {
    id: "teal",
    label: "Deep Teal",
    bg: "#1a4f5c",
    text: "#ffffff",
    accent: "#e5b0b8",
    subtextColor: "#c4d7dc",
  },
  {
    id: "burgundy",
    label: "Burgundy",
    bg: "#7c2e40",
    text: "#ffffff",
    accent: "#e6d6a0",
    subtextColor: "#e5b0b8",
  },
  {
    id: "cream",
    label: "Warm Cream",
    bg: "#f9f5f2",
    text: "#1a4f5c",
    accent: "#7c2e40",
    subtextColor: "#5f7a82",
  },
  {
    id: "lavender",
    label: "Soft Lavender",
    bg: "#f3eef6",
    text: "#1a4f5c",
    accent: "#7c2e40",
    subtextColor: "#b189ab",
  },
];

export default function QuoteCard({ output, platform }) {
  const cardRef = useRef(null);
  const [styleIndex, setStyleIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const style = CARD_STYLES[styleIndex];

  if (!output?.hook) return null;

  const isSquare = platform === "Instagram" || platform === "Facebook";
  const aspectClass = isSquare ? "aspect-square" : "aspect-video";

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `change180-${platform.toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // silent fail
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--muted)]">Downloadable Quote Card</p>
        <div className="flex gap-1.5">
          {CARD_STYLES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              title={s.label}
              onClick={() => setStyleIndex(i)}
              className={`h-5 w-5 rounded-full border-2 transition ${
                i === styleIndex ? "border-[var(--primary)] scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: s.bg }}
            />
          ))}
        </div>
      </div>

      <div
        ref={cardRef}
        className={`${aspectClass} relative flex flex-col items-center justify-center overflow-hidden rounded-2xl px-10 py-8`}
        style={{ backgroundColor: style.bg }}
      >
        {/* Decorative top accent */}
        <div
          className="absolute left-0 top-0 h-1.5 w-full"
          style={{ backgroundColor: style.accent }}
        />

        <p
          className="mb-6 text-center text-xl font-bold leading-snug sm:text-2xl"
          style={{ color: style.text }}
        >
          &ldquo;{output.hook}&rdquo;
        </p>

        {output.cta && (
          <p
            className="mb-6 text-center text-sm"
            style={{ color: style.subtextColor }}
          >
            {output.cta}
          </p>
        )}

        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
            style={{ backgroundColor: style.accent, color: style.bg }}
          >
            C
          </div>
          <p className="text-xs font-semibold tracking-wide" style={{ color: style.subtextColor }}>
            CHANGE180
          </p>
        </div>
      </div>

      <div className="mt-2">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          variant="ghost"
          className="w-full text-sm"
        >
          {downloading ? "Exporting..." : "Download as PNG"}
        </Button>
      </div>
    </div>
  );
}
