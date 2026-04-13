import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function CapturePage() {
  return (
    <PageShell
      eyebrow="Step 02"
      title="Capture and confirm the user photo."
      description="This page stands in for the camera experience. It gives us a place to build the screenshot confirmation interactions you mentioned in your EOD notes."
      primaryCta={{ href: "/results", label: "Use sample result" }}
      secondaryCta={{ href: "/testing", label: "Back to intro" }}
    >
      <div className="space-y-5 rounded-[1.5rem] bg-surface-strong p-6">
        <div className="rounded-[1.75rem] border border-dashed border-line bg-[linear-gradient(180deg,#f8e8dc_0%,#fdf8f3_100%)] p-5">
          <div className="flex aspect-[4/5] items-center justify-center rounded-[1.25rem] bg-white/80">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-deep">
                Camera placeholder
              </p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                We can replace this block with a live camera preview or upload flow once you are ready.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className="rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-white">
            Capture image
          </button>
          <button className="rounded-2xl border border-line bg-white/80 px-5 py-4 text-sm font-semibold text-foreground">
            Retake image
          </button>
        </div>

        <div className="rounded-2xl border border-line bg-white/70 p-5 text-sm leading-6 text-muted">
          Planned behavior:
          <br />
          Back arrow reloads the page.
          <br />
          Continue confirms the image and submits the user into results.
          <br />
          Support text can reassure the user when the image is saved successfully.
        </div>

        <Link
          href="/results"
          className="inline-flex w-full items-center justify-center rounded-2xl border border-line bg-surface px-5 py-4 text-sm font-semibold text-foreground hover:bg-white/90"
        >
          Proceed with sample analysis
        </Link>
      </div>
    </PageShell>
  );
}
