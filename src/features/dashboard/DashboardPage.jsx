import { useSearchParams } from "react-router-dom";
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

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {hasSuggestedMoves ? (
          <Card title="Suggested Next Moves" subtitle="What the system should help you do next">
            <ul className="space-y-3 text-sm">
              {suggestedNextMoves.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
                <li key={item.id || `${item.platform}-${item.hook}`}>
                  {item.hook || item.topic} - {item.platform} {item.contentType}
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
