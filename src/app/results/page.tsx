import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { analysisCategories } from "@/lib/analysis-content";

export default function ResultsPage() {
  const averageScore = Math.round(
    analysisCategories.reduce((sum, item) => sum + item.score, 0) /
      analysisCategories.length,
  );

  return (
    <PageShell
      eyebrow="Step 03"
      title="Summarize the scan with category-based insights."
      description="This page gives you a strong working shell for the results dashboard. Each card already links to a detail route so you can build out the full result story screen by screen."
      primaryCta={{ href: "/results/hydration", label: "Open first category" }}
      secondaryCta={{ href: "/capture", label: "Return to capture" }}
    >
      <div className="space-y-5 rounded-[1.5rem] bg-surface-strong p-6">
        <div className="grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-3xl bg-[#fff2e8] p-5 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-accent-deep">
              Overall
            </p>
            <p className="mt-4 text-5xl font-semibold text-foreground">
              {averageScore}
            </p>
            <p className="mt-2 text-sm text-muted">Balanced skin health score</p>
          </div>
          <div className="rounded-3xl border border-line bg-white/70 p-5">
            <p className="text-sm font-semibold text-foreground">
              Snapshot summary
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              The mock analysis suggests healthy tone and hydration with some room
              to improve texture and pore refinement. This is placeholder content,
              but the information architecture is now ready for real data.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {analysisCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/results/${category.slug}`}
              className="rounded-3xl border border-line bg-white/75 p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {category.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{category.summary}</p>
                </div>
                <div
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: category.accent }}
                >
                  {category.score}/100
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
