import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16 text-center">
      <div className="w-full rounded-[2rem] border border-line bg-surface p-8 shadow-[0_20px_70px_rgba(138,63,46,0.12)] backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-deep">
          Missing category
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          That result page does not exist yet.
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          The route is wired correctly, but this category has not been created in
          the mock dataset yet.
        </p>
        <Link
          href="/results"
          className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
        >
          Back to results
        </Link>
      </div>
    </main>
  );
}
