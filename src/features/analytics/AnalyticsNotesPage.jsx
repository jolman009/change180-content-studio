import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCw, Eye, Users, Heart, MessageCircle, Share2, MousePointerClick } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import { getPerformanceLogs, savePerformanceLog, fetchPostMetrics } from "../../services/analyticsService";
import { getContentPosts } from "../../services/contentService";

const initialForm = {
  postTitle: "",
  platform: "Instagram",
  outcome: "",
  insight: "",
  nextMove: "",
};

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-3">
      <Icon size={16} className="shrink-0 text-[var(--accent)]" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function PostMetricsCard({ post, onRefresh, isRefreshing }) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate font-semibold">{post.hook || post.topic}</h4>
          <p className="text-xs text-gray-500">
            {post.platform} · Published{" "}
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRefresh(post.id)}
          disabled={isRefreshing}
          className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-white hover:text-[var(--primary)]"
          aria-label="Refresh metrics"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {post.metrics ? (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          <MetricCard icon={Eye} label="Impressions" value={post.metrics.impressions?.toLocaleString()} />
          <MetricCard icon={Users} label="Reach" value={post.metrics.reach?.toLocaleString()} />
          <MetricCard icon={Heart} label="Likes" value={post.metrics.likes?.toLocaleString()} />
          <MetricCard icon={MessageCircle} label="Comments" value={post.metrics.comments?.toLocaleString()} />
          <MetricCard icon={Share2} label="Shares" value={post.metrics.shares?.toLocaleString()} />
          <MetricCard icon={MousePointerClick} label="Clicks" value={post.metrics.clicks?.toLocaleString()} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-400">No metrics yet. Click refresh to fetch.</p>
      )}
    </article>
  );
}

export default function AnalyticsNotesPage() {
  const [form, setForm] = useState(initialForm);
  const [logs, setLogs] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshingPostId, setRefreshingPostId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [logsResult, postsResult] = await Promise.all([
          getPerformanceLogs(),
          getContentPosts(),
        ]);

        if (active) {
          setLogs(logsResult.data);
          setPublishedPosts(
            postsResult.data
              .filter((p) => p.status === "posted" && p.publishedAt)
              .slice(0, 10)
              .map((p) => ({ ...p, metrics: null }))
          );
          if (logsResult.source !== "supabase") {
            toast.info(
              `Analytics notes are running in local demo mode. ${logsResult.fallbackReason ?? ""}`.trim()
            );
          }
        }
      } catch (error) {
        if (active) {
          toast.error(error.message || "Unable to load analytics data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  async function handleRefreshMetrics(postId) {
    setRefreshingPostId(postId);
    try {
      const result = await fetchPostMetrics(postId);
      setPublishedPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, metrics: result.data } : p))
      );
    } catch (err) {
      toast.error(err.message || "Failed to fetch metrics.");
    } finally {
      setRefreshingPostId(null);
    }
  }

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSave() {
    if (!form.postTitle.trim() || !form.outcome.trim() || !form.insight.trim()) {
      toast.error("Post title, outcome, and insight are required before saving.");
      return;
    }

    setSaving(true);

    try {
      const result = await savePerformanceLog(form);
      setLogs((prev) => [result.data, ...prev]);
      setForm(initialForm);
      if (result.source === "supabase") {
        toast.success("Analytics note saved.");
      } else {
        toast.info(
          `Analytics note saved in local demo mode. ${result.fallbackReason ?? ""}`.trim()
        );
      }
    } catch (error) {
      toast.error(error.message || "Unable to save analytics note.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Loading Analytics"
        description="Pulling performance data and observations."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Metrics Dashboard */}
      {publishedPosts.length > 0 ? (
        <Card title="Post Metrics" subtitle="Engagement data from published posts">
          <div className="space-y-4">
            {publishedPosts.map((post) => (
              <PostMetricsCard
                key={post.id}
                post={post}
                onRefresh={handleRefreshMetrics}
                isRefreshing={refreshingPostId === post.id}
              />
            ))}
          </div>
        </Card>
      ) : null}

      {/* Manual Notes Form */}
      <Card
        title="Analytics Notes"
        subtitle="Capture what happened after posting so future content choices get sharper."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Post Title"
            name="postTitle"
            value={form.postTitle}
            onChange={onChange}
            placeholder="Ex: Reset after a hard week"
          />
          <Input
            label="Platform"
            name="platform"
            value={form.platform}
            onChange={onChange}
            placeholder="Instagram"
          />
        </div>

        <div className="mt-4 space-y-4">
          <Textarea
            label="Outcome"
            name="outcome"
            value={form.outcome}
            onChange={onChange}
            placeholder="Ex: Strong saves, moderate comments, weak click-through."
          />
          <Textarea
            label="Insight"
            name="insight"
            value={form.insight}
            onChange={onChange}
            placeholder="Ex: Simple hooks and practical next steps performed better than abstract encouragement."
          />
          <Textarea
            label="Next Move"
            name="nextMove"
            value={form.nextMove}
            onChange={onChange}
            placeholder="Ex: Create two follow-up captions and one carousel on this theme."
          />
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 sm:max-w-xl">
            Use this log weekly to spot hooks, themes, and CTAs worth repeating.
          </p>
          <Button className="w-full sm:w-auto" onClick={onSave} disabled={saving}>
            {saving ? "Saving Note..." : "Save Note"}
          </Button>
        </div>
      </Card>

      {/* Recent Notes */}
      {logs.length === 0 ? (
        <EmptyState
          title="Recent Notes"
          description="No analytics notes yet. Log your first post outcome to start seeing patterns."
        />
      ) : (
        <Card title="Recent Notes" subtitle="Latest post-performance observations">
          <div className="space-y-4">
            {logs.map((log) => (
              <article key={log.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="font-semibold">{log.postTitle}</h4>
                    <p className="text-sm text-gray-500">{log.platform}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {log.loggedAt ? new Date(log.loggedAt).toLocaleDateString("en-US") : ""}
                  </p>
                </div>
                <p className="mt-3 text-sm"><span className="font-medium">Outcome:</span> {log.outcome}</p>
                <p className="mt-2 text-sm"><span className="font-medium">Insight:</span> {log.insight}</p>
                {log.nextMove ? (
                  <p className="mt-2 text-sm"><span className="font-medium">Next Move:</span> {log.nextMove}</p>
                ) : null}
              </article>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
