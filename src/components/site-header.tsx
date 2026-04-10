import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="h-16 w-full border-b border-black/5 bg-background">
      <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between px-4 sm:px-8 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="text-[14px] font-semibold uppercase leading-4 tracking-[-0.02em] text-[#1A1B1C]"
          >
            Skinstric
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-medium leading-4 tracking-[-0.02em] text-black/60 sm:text-[12px]">
            <span>[INTRO]</span>
          </div>
        </div>

        <Link
          href="/analyze"
          className="inline-flex h-8 items-center justify-center bg-[white] px-4 text-[10px] font-semibold uppercase leading-4 tracking-[-0.02em] text-[black] transition-colors hover:bg-black hover:text-white"
        >
          Enter code
        </Link>
      </div>
    </header>
  );
}
