import Link from "next/link";
import { milestones } from "@/lib/analysis-content";

export default function Home() {
  const stack = [
    "Next.js App Router",
    "TypeScript",
    "Tailwind CSS v4",
    "ESLint and clean import aliases",
  ];

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <section className="grid flex-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted shadow-sm backdrop-blur">
            Skinstric internship build workspace
          </div>

          <div className="space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-deep">
              App foundation
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              A clean starting point for the camera-to-results experience.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              The starter template has been replaced with a focused project shell
              so we can move straight into building the onboarding, capture, and
              results flows from your Figma and reference site.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-accent-deep"
              href="/analyze"
            >
              Start prototype flow
            </Link>
            <Link
              className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/90"
              href="/results"
            >
              Jump to results
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_70px_rgba(138,63,46,0.12)] backdrop-blur">
          <div className="rounded-[1.5rem] bg-surface-strong p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-deep">
              First build targets
            </p>
            <ul className="mt-5 space-y-4">
              {milestones.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-line bg-white/70 px-4 py-4 text-sm leading-6 text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-[#fff4eb] p-5">
              <p className="text-sm font-semibold text-accent-deep">Scaffold choices</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <a
                href="https://skinstric-wandag.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-white/70 px-4 py-2 text-foreground"
              >
                Reference site
              </a>
              <a
                href="https://www.figma.com/design/K43I2D7c3xgt1ZiF6lY1Yq/Skinstric?node-id=12-15671&t=lTlbWTL8Nw9jLWHZ-0"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-white/70 px-4 py-2 text-foreground"
              >
                Figma file
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
