export default function PublishStatusBadge({ publishedAt, platformPostId, publishError, platform }) {
  if (publishedAt) {
    const formattedDate = new Date(publishedAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        Published to {platform} &middot; {formattedDate}
        {platformPostId ? (
          <span className="ml-1 text-xs text-emerald-500">({platformPostId})</span>
        ) : null}
      </div>
    );
  }

  if (publishError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        Publish failed: {publishError}
      </div>
    );
  }

  return null;
}
