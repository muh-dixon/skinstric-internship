import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { analysisCategories } from "@/lib/analysis-content";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const currentCategory = analysisCategories.find((item) => item.slug === category);

  if (!currentCategory) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Category detail"
      title={`${currentCategory.title} insight`}
      description="Each result category can have its own focused explanation, visual treatment, and recommended next action. This keeps the results system modular and easier to expand."
      primaryCta={{ href: "/results", label: "Back to all results" }}
      secondaryCta={{ href: "/capture", label: "Retake photo" }}
    >
      <div className="space-y-5 rounded-[1.5rem] bg-surface-strong p-6">
        <div className="rounded-3xl p-6 text-white" style={{ backgroundColor: currentCategory.accent }}>
          <p className="text-sm uppercase tracking-[0.24em] text-white/80">
            Score
          </p>
          <p className="mt-3 text-5xl font-semibold">{currentCategory.score}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/85">
            {currentCategory.summary}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white/75 p-5">
            <p className="text-sm font-semibold text-foreground">Observation</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {currentCategory.insight}
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-white/75 p-5">
            <p className="text-sm font-semibold text-foreground">Suggested action</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {currentCategory.nextStep}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-white/75 p-5">
          <p className="text-sm font-semibold text-foreground">Continue exploring</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {analysisCategories
              .filter((item) => item.slug !== currentCategory.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/results/${item.slug}`}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/90"
                >
                  {item.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
