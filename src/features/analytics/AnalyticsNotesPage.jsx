import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import { getPerformanceLogs, savePerformanceLog } from "../../services/analyticsService";

const initialForm = {
  postTitle: "",
  platform: "Instagram",
  outcome: "",
  insight: "",
  nextMove: "",
};

export default function AnalyticsNotesPage() {
  const [form, setForm] = useState(initialForm);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;

    async function loadLogs() {
      try {
        const result = await getPerformanceLogs();
        if (active) {
          setLogs(result.data);
          setStatus({
            type: result.source === "supabase" ? "info" : "error",
            message:
              result.source === "supabase"
                ? "Analytics notes loaded from Supabase."
                : `Analytics notes are currently running in local demo mode. ${result.fallbackReason ?? ""}`.trim(),
          });
        }
      } catch (error) {
        if (active) {
          setStatus({ type: "error", message: error.message || "Unable to load analytics notes." });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      active = false;
    };
  }, []);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status.type === "error") {
      setStatus({ type: "", message: "" });
    }
  }

  async function onSave() {
    if (!form.postTitle.trim() || !form.outcome.trim() || !form.insight.trim()) {
      setStatus({
        type: "error",
        message: "Post title, outcome, and insight are required before saving.",
      });
      return;
    }

    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const result = await savePerformanceLog(form);
      setLogs((prev) => [result.data, ...prev]);
      setForm(initialForm);
      setStatus({
        type: result.source === "supabase" ? "success" : "error",
        message:
          result.source === "supabase"
            ? "Analytics note saved to Supabase."
            : `Analytics note saved in local demo mode. ${result.fallbackReason ?? ""}`.trim(),
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save analytics note.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Loading Analytics Notes"
        description="Pulling recent performance observations into the log."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card
        title="Analytics Notes"
        subtitle="Capture what happened after posting so future content choices get sharper."
      >
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
