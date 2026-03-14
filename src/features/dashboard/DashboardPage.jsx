import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import {
  mockDashboardStats,
  mockRecentDrafts,
  mockSuggestedNextMoves,
} from "../../lib/mockData";

export default function DashboardPage() {
  const hasSuggestedMoves = mockSuggestedNextMoves.length > 0;
  const hasRecentDrafts = mockRecentDrafts.length > 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {mockDashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {hasSuggestedMoves ? (
          <Card title="Suggested Next Moves" subtitle="What the system should help you do next">
            <ul className="space-y-3 text-sm">
              {mockSuggestedNextMoves.map((item) => (
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
              {mockRecentDrafts.map((item) => (
                <li key={item}>{item}</li>
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
