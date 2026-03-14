import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import Select from "../ui/Select";
import Input from "../ui/Input";
import { POST_STATUSES } from "../../lib/constants";

export default function CalendarBoard({
  groups = [],
  savingPostId,
  onStatusChange,
  onScheduleChange,
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
      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.date} className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h4 className="font-semibold text-[var(--text)]">{group.label}</h4>
              <span className="text-sm text-gray-500">{group.items.length} post(s)</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {group.items.map((post) => (
                <article
                  key={post.id || `${post.topic}-${post.hook}`}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{post.hook || post.topic}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {post.platform} · {post.contentType} · {post.pillar}
                      </p>
                    </div>
                    <span className="inline-block rounded-full bg-white px-3 py-1 text-xs capitalize">
                      {post.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 line-clamp-3">{post.body || post.cta}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
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
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Card>
  );
}
