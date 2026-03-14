import { Link, useSearchParams } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import {
  applyContentFilters,
  buildDashboardStats,
  buildRecentDrafts,
  buildSuggestedNextMoves,
  getContentFiltersFromSearchParams,
} from "../../lib/contentPipeline";
import { getSuggestedMoveDestination } from "../../lib/nextMovesPlan";
import { useContentPosts } from "../content/useContentPosts";

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const filters = getContentFiltersFromSearchParams(searchParams);
  const { posts, loading, error } = useContentPosts();

  if (loading) {
    return (
      <LoadingState
        title="Loading Dashboard"
        description="Pulling draft and calendar metrics into the dashboard."
      />
    );
  }

  if (error) {
    return <ErrorState title="Dashboard" message={error} />;
  }

  const filteredPosts = applyContentFilters(posts, filters);
  const dashboardStats = buildDashboardStats(filteredPosts);
  const suggestedNextMoves = buildSuggestedNextMoves(filteredPosts);
  const recentDrafts = buildRecentDrafts(filteredPosts);
  const hasSuggestedMoves = suggestedNextMoves.length > 0;
  const hasRecentDrafts = recentDrafts.length > 0;
  const operatorSteps = [
    {
      title: "Refresh Brand Voice",
      description: "Review tone rules and CTAs before generating anything new.",
    },
    {
      title: "Build This Week's Drafts",
      description: "Generate, rewrite, and save a balanced set of posts.",
    },
    {
      title: "Log What Worked",
      description: "Capture outcomes so the next batch gets sharper.",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card
        title="Weekly Operator View"
        subtitle="Start here if this is your first pass through the studio this week."
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 sm:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
            This Week
          </p>
          <ol className="mt-3 space-y-3">
            {operatorSteps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[var(--primary)]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold">{step.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="hidden gap-4 sm:grid sm:grid-cols-3">
          {operatorSteps.map((step, index) => (
            <div key={step.title} className="rounded-xl bg-[var(--bg)] p-4">
              <h4 className="font-semibold">
                {index + 1}. {step.title}
              </h4>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {hasSuggestedMoves ? (
          <Card title="Suggested Next Moves" subtitle="What the system should help you do next">
            <ul className="space-y-3 text-sm">
              {suggestedNextMoves.map((item) => (
                <li key={item} className="rounded-xl bg-[var(--bg)] px-3 py-3">
                  <Link className="flex items-start justify-between gap-3" to={getSuggestedMoveDestination(item)}>
                    <span>{item}</span>
                    <span className="shrink-0 font-medium text-[var(--primary)]">Open</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link className="text-sm font-medium text-[var(--primary)] underline" to="/next-moves">
                Open the acquisition playbook
              </Link>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="Suggested Next Moves"
            description="Suggestions will appear here once content gaps and planning signals are wired up."
          />
        )}

        {hasRecentDrafts ? (
          <Card title="Recent Drafts" subtitle="Latest content in the pipeline">
            <ul className="space-y-3 text-sm">
              {recentDrafts.map((item) => (
                <li
                  key={item.id || `${item.platform}-${item.hook}`}
                  className="rounded-xl bg-[var(--bg)] px-3 py-3"
                >
                  <Link className="font-medium underline" to={`/create/${item.id}`}>
                    <span className="break-words">{item.hook || item.topic}</span>
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.platform} · {item.contentType}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState
            title="Recent Drafts"
            description="Draft activity will appear here after the content workflow is connected to storage."
          />
        )}
      </section>
    </div>
  );
}
