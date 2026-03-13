import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Draft Posts" value="12" />
        <StatCard label="Approved" value="5" />
        <StatCard label="Scheduled" value="8" />
        <StatCard label="Posted This Month" value="21" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Suggested Next Moves" subtitle="What the system should help you do next">
          <ul className="space-y-3 text-sm">
            <li>Build 3 mindset posts for next week.</li>
            <li>Create one carousel promoting coaching intake.</li>
            <li>Repurpose your strongest reflection into a reel script.</li>
          </ul>
        </Card>

        <Card title="Recent Drafts" subtitle="Latest content in the pipeline">
          <ul className="space-y-3 text-sm">
            <li>“When progress feels slow, keep walking.” — Instagram Caption</li>
            <li>“5 signs you need clarity, not more pressure.” — Carousel</li>
            <li>“Self-sabotage does not always look loud.” — Facebook Post</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}