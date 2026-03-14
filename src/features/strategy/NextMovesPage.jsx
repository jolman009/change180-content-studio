import { ArrowRight, CalendarRange, Layers3, Repeat2, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import {
  ctaLadder,
  infrastructureNotes,
  kpiLoop,
  productionChecklist,
  repurposingPlan,
  weekdayCadence,
  weeklyMessageArc,
} from "../../lib/nextMovesPlan";

const highlightCards = [
  {
    title: "One weekly theme",
    description: "Run the week around one clear idea so the brand promise feels repeated, not random.",
    icon: Layers3,
  },
  {
    title: "One conversion action",
    description: "Choose either keyword DMs or website clicks as the primary ask before you draft.",
    icon: Target,
  },
  {
    title: "One batch system",
    description: "Create the week in one pass and repurpose each asset instead of producing from zero every day.",
    icon: Repeat2,
  },
];

export default function NextMovesPage() {
  return (
    <div className="space-y-6">
      <Card
        title="Acquisition Playbook"
        subtitle="Adapted from the attached Change180 social calendar and narrowed to what fits this product."
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="max-w-3xl text-sm text-gray-600">
              This page turns the compatible parts of the social calendar into an operator view for
              Change180: weekly themes, weekday cadence, CTA ladder, KPI review, and a production
              loop you can actually run inside this app.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {weeklyMessageArc.map((theme) => (
                <span
                  key={theme.id}
                  className="rounded-full bg-[var(--bg)] px-3 py-1 text-sm font-medium text-[var(--text)]"
                >
                  {theme.title}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                to="/create"
              >
                Create New Draft
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-white"
                to="/calendar"
              >
                Review Calendar
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
              Source Fit
            </p>
            <ul className="mt-3 space-y-3 text-sm text-gray-600">
              <li>Uses only the compatible ideas from the attached calendar, not the full PDF verbatim.</li>
              <li>Stays aligned to the app's actual content types: carousel, reel, quote, caption, and story.</li>
              <li>Focuses on new-client acquisition without inventing testimonials, pricing, or unsupported claims.</li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {highlightCards.map((card) => (
          <Card key={card.title} className="bg-white">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-[var(--bg)] p-3">
                <card.icon size={18} className="text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="text-base font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <Card
        title="Weekly Message Arc"
        subtitle="A four-week sequence pulled from the calendar and adapted to the current product."
        className="scroll-mt-24"
      >
        <div id="weekly-arc" className="grid gap-4 lg:grid-cols-2">
          {weeklyMessageArc.map((theme) => (
            <article key={theme.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                    {theme.label}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{theme.title}</h3>
                </div>
                <Sparkles size={18} className="shrink-0 text-[var(--secondary)]" />
              </div>
              <p className="mt-3 text-sm text-gray-600">{theme.summary}</p>
              <p className="mt-3 text-sm">
                <span className="font-medium">Focus:</span> {theme.focus}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Best fit formats:</span> {theme.bestFormats.join(", ")}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">CTA pattern:</span> {theme.cta}
              </p>
            </article>
          ))}
        </div>
      </Card>

      <Card
        title="Weekday Cadence"
        subtitle="A Monday-Friday production rhythm that fits the current app's saved drafts and calendar workflow."
        className="scroll-mt-24"
      >
        <div id="cadence" className="space-y-3">
          {weekdayCadence.map((item) => (
            <article
              key={item.day}
              className="grid gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 md:grid-cols-[120px_1fr_220px]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                  {item.day}
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--text)]">{item.format}</p>
              </div>
              <p className="text-sm text-gray-600">{item.purpose}</p>
              <div className="rounded-xl bg-[var(--bg)] px-3 py-3 text-sm">
                <span className="font-medium">Primary KPI:</span> {item.idealKpi}
              </div>
            </article>
          ))}
        </div>
      </Card>

      <section id="cta-kpi" className="grid scroll-mt-24 gap-6 xl:grid-cols-2">
        <Card
          title="CTA Ladder"
          subtitle="Rotate lower-friction and higher-friction asks instead of pushing the same CTA every day."
        >
          <div className="space-y-4">
            {ctaLadder.map((step) => (
              <article key={step.title} className="rounded-2xl bg-[var(--bg)] p-4">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {step.examples.map((example) => (
                    <li key={example} className="flex gap-2">
                      <ArrowRight size={16} className="mt-0.5 shrink-0 text-[var(--secondary)]" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Card>

        <Card
          title="KPI Review Loop"
          subtitle="Track business movement, not vanity metrics alone."
        >
          <div className="space-y-4">
            {kpiLoop.map((group) => (
              <article key={group.title} className="rounded-2xl bg-[var(--bg)] p-4">
                <h3 className="text-base font-semibold">{group.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white px-3 py-1 text-sm text-[var(--text)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card title="Production Checklist" subtitle="Keep execution predictable and reusable every week.">
          <div className="space-y-3">
            {productionChecklist.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-[var(--bg)] px-4 py-3 text-sm">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white font-semibold text-[var(--primary)]">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Repurpose Every Asset" subtitle="Extend each draft into more touchpoints without redoing the strategy.">
          <div className="space-y-3">
            {repurposingPlan.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-[var(--bg)] px-4 py-3 text-sm">
                <CalendarRange size={18} className="mt-0.5 shrink-0 text-[var(--secondary)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card title="AI Infrastructure Notes" subtitle="Current implementation suggestions worth considering as the studio grows.">
        <div className="grid gap-4 md:grid-cols-2">
          {infrastructureNotes.map((note) => (
            <article key={note.title} className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
              <h3 className="text-base font-semibold">{note.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{note.description}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
