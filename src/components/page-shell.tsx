import Link from "next/link";
import { ReactNode } from "react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  primaryCta?: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  primaryCta,
  secondaryCta,
}: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">
            Skinstric prototype
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-deep">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted">{description}</p>

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-4">
              {primaryCta ? (
                <Link
                  href={primaryCta.href}
                  className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-accent-deep"
                >
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/90"
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_70px_rgba(138,63,46,0.12)] backdrop-blur">
          {children}
        </div>
      </section>
    </main>
  );
}
