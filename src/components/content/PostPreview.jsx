const platformStyles = {
  Instagram: {
    wrapper: "rounded-2xl border border-[var(--border)] bg-white overflow-hidden",
    header: "flex items-center gap-2 px-3 py-2.5",
    avatar: "h-8 w-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold",
    username: "text-sm font-semibold",
    imageArea: "aspect-square bg-gradient-to-br from-[var(--bg)] to-[var(--border)] flex items-center justify-center px-8",
    body: "px-3 py-2.5 space-y-1.5",
    hookClass: "text-sm font-semibold",
    captionClass: "text-sm leading-relaxed",
    ctaClass: "text-sm text-[var(--primary)] font-medium",
    hashtagClass: "text-xs text-[var(--accent)]",
    label: "Instagram Post",
  },
  Facebook: {
    wrapper: "rounded-xl border border-[var(--border)] bg-white overflow-hidden",
    header: "flex items-center gap-2.5 px-3 py-2.5",
    avatar: "h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold",
    username: "text-sm font-semibold",
    imageArea: "aspect-video bg-gradient-to-br from-[var(--bg)] to-[var(--border)] flex items-center justify-center px-8",
    body: "px-3 py-2.5 space-y-1.5",
    hookClass: "text-sm font-semibold",
    captionClass: "text-sm leading-relaxed",
    ctaClass: "text-sm text-[var(--primary)] font-medium",
    hashtagClass: "text-xs text-[var(--accent)]",
    label: "Facebook Post",
  },
  LinkedIn: {
    wrapper: "rounded-lg border border-[var(--border)] bg-white overflow-hidden",
    header: "flex items-center gap-2.5 px-4 py-3",
    avatar: "h-12 w-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold",
    username: "text-sm font-semibold",
    imageArea: "aspect-video bg-gradient-to-br from-[var(--bg)] to-[var(--border)] flex items-center justify-center px-8",
    body: "px-4 py-3 space-y-2",
    hookClass: "text-sm font-semibold",
    captionClass: "text-sm leading-relaxed",
    ctaClass: "text-sm text-[var(--primary)] font-medium",
    hashtagClass: "text-xs text-[var(--accent)]",
    label: "LinkedIn Post",
  },
  X: {
    wrapper: "rounded-2xl border border-[var(--border)] bg-white overflow-hidden",
    header: "flex items-center gap-2 px-3 py-2.5",
    avatar: "h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold",
    username: "text-sm font-semibold",
    imageArea: null,
    body: "px-3 py-2.5 space-y-1.5",
    hookClass: "text-[15px] font-normal",
    captionClass: "text-[15px] leading-relaxed",
    ctaClass: "text-[15px] text-[var(--primary)]",
    hashtagClass: "text-sm text-[var(--accent)]",
    label: "Post on X",
  },
};

export default function PostPreview({ output, platform, contentType }) {
  if (!output) return null;

  const style = platformStyles[platform] || platformStyles.Instagram;
  const showImageArea = style.imageArea && contentType !== "Reel Script";

  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-medium text-[var(--muted)]">{style.label} Preview</p>
      <div className={style.wrapper}>
        <div className={style.header}>
          <div className={style.avatar}>C</div>
          <div>
            <p className={style.username}>change180</p>
            <p className="text-xs text-[var(--muted)]">Change180 Life Coaching</p>
          </div>
        </div>

        {showImageArea && (
          <div className={style.imageArea}>
            <p className="text-center text-lg font-semibold leading-snug text-[var(--secondary)]">
              {output.hook}
            </p>
          </div>
        )}

        <div className={style.body}>
          {!showImageArea && (
            <p className={style.hookClass}>{output.hook}</p>
          )}
          <p className={style.captionClass}>
            {output.caption?.length > 280
              ? `${output.caption.slice(0, 280).trimEnd()}... `
              : output.caption}
          </p>
          <p className={style.ctaClass}>{output.cta}</p>
          {output.hashtags?.length > 0 && (
            <p className={style.hashtagClass}>{output.hashtags.join(" ")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
