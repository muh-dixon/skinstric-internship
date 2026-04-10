import { PageShell } from "@/components/page-shell";
import { milestones } from "@/lib/analysis-content";

export default function AnalyzePage() {
  return (
    <PageShell
      eyebrow="Step 01"
      title="Guide the user into the skin analysis flow."
      description="This route can become the first product-facing screen from Figma. For now it frames the experience, explains what the scan does, and prepares the user to continue into capture."
      primaryCta={{ href: "/capture", label: "Continue to capture" }}
      secondaryCta={{ href: "/results", label: "Preview result screens" }}
    >
      <div className="rounded-[1.5rem] bg-surface-strong p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-deep">
          Flow map
        </p>
        <ul className="mt-5 space-y-4">
          {milestones.map((item, index) => (
            <li
              key={item}
              className="flex items-start gap-4 rounded-2xl border border-line bg-white/70 px-4 py-4"
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1e6] text-sm font-semibold text-accent-deep">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item}</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Placeholder structure is ready so we can replace this with final copy and layout later.
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
