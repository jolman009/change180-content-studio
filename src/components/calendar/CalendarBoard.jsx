import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PublishStatusBadge from "../content/PublishStatusBadge";
import PublishButton from "../content/PublishButton";
import DuplicateToMenu from "./DuplicateToMenu";
import { POST_STATUSES } from "../../lib/constants";

function ScheduledCountdown({ scheduledFor }) {
  if (!scheduledFor) return null;

  const scheduled = new Date(`${scheduledFor}T12:00:00`);
  const now = new Date();
  const diffMs = scheduled - now;

  if (diffMs <= 0) return <span className="text-xs text-amber-600">Due now</span>;

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return (
    <span className="inline-flex items-center gap-1 text-xs text-sky-600">
      <Clock size={12} />
      {days === 1 ? "Tomorrow" : `In ${days} days`}
    </span>
  );
}

export default function CalendarBoard({
  groups = [],
  savingPostId,
  onStatusChange,
  onScheduleChange,
  onPublish,
  publishingPostId,
  onDuplicate,
  duplicatingPostId,
}) {
  if (groups.length === 0) {
    return (
      <EmptyState
        title="Weekly Calendar"
        description="Scheduled content will appear here once the calendar is connected to saved posts."
      />
    );
  }

  return (
    <Card title="Weekly Calendar" subtitle="Grouped by scheduled date with editable pipeline state">
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">Create a new draft</p>
          <p className="mt-1 text-sm text-gray-500">
            Start something new without opening an existing saved draft.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 touch-manipulation"
          to="/create"
        >
          Create New Draft
        </Link>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.date} className="space-y-3">
            <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-2 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-semibold text-[var(--text)]">{group.label}</h4>
              <span className="text-sm text-gray-500">{group.items.length} post(s)</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {group.items.map((post) => {
                const isScheduled = post.status === "scheduled";
                const canSchedule =
                  post.status === "approved" && post.scheduledFor;

                return (
                  <article
                    key={post.id || `${post.topic}-${post.hook}`}
                    className={`rounded-xl border p-4 ${
                      isScheduled
                        ? "border-sky-200 bg-sky-50/40"
                        : "border-[var(--border)] bg-[var(--bg)]"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      {post.mediaUrl ? (
                        <img
                          src={post.mediaUrl}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                          Saved Draft
                        </p>
                        <Link
                          className="mt-1 block text-sm font-semibold underline touch-manipulation"
                          to={`/create/${post.id}`}
                        >
                          <span className="break-words">{post.hook || post.topic}</span>
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">
                          {post.platform} · {post.contentType} · {post.pillar}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isScheduled ? (
                          <ScheduledCountdown scheduledFor={post.scheduledFor} />
                        ) : null}
                        <span
                          className={`inline-block w-fit rounded-full px-3 py-1 text-xs capitalize ${
                            isScheduled
                              ? "bg-sky-100 text-sky-700"
                              : "bg-white"
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Select
                        label="Status"
                        value={post.status}
                        onChange={(event) => onStatusChange(post.id, event.target.value)}
                        disabled={savingPostId === post.id}
                      >
                        {POST_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>

                      <Input
                        label="Scheduled For"
                        type="date"
                        value={post.scheduledFor || ""}
                        onChange={(event) => onScheduleChange(post.id, event.target.value)}
                        disabled={savingPostId === post.id}
                      />
                    </div>

                    {canSchedule ? (
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="ghost"
                          onClick={() => onStatusChange(post.id, "scheduled")}
                          disabled={savingPostId === post.id}
                          className="text-sm"
                        >
                          <Clock size={14} className="mr-1.5 inline-block" />
                          Schedule for Auto-Publish
                        </Button>
                      </div>
                    ) : null}

                    {(post.publishedAt || post.publishError) ? (
                      <div className="mt-3">
                        <PublishStatusBadge
                          publishedAt={post.publishedAt}
                          platformPostId={post.platformPostId}
                          publishError={post.publishError}
                          platform={post.platform}
                        />
                      </div>
                    ) : null}

                    {onPublish && !post.publishedAt ? (
                      <div className="mt-3 flex justify-end">
                        <PublishButton
                          post={post}
                          onPublish={onPublish}
                          isPublishing={publishingPostId === post.id}
                          disabled={savingPostId === post.id}
                        />
                      </div>
                    ) : null}

                    {onDuplicate ? (
                      <div className="mt-3 border-t border-[var(--border)] pt-3">
                        <DuplicateToMenu
                          currentPlatform={post.platform}
                          onDuplicate={(targetPlatform) => onDuplicate(post.id, targetPlatform)}
                          disabled={duplicatingPostId === post.id || savingPostId === post.id}
                        />
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </Card>
  );
}
