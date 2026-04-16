import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="h-14 w-full bg-background">
      <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between px-5 sm:px-7 xl:px-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-[10px] font-semibold uppercase leading-4 tracking-[-0.02em] text-[#1A1B1C] sm:text-[11px]"
          >
            Skinstric
          </Link>

          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase leading-4 tracking-[-0.02em] text-black/60 sm:text-[11px]">
            <span>[</span>
            <span>Intro</span>
            <span>]</span>
          </div>
        </div>

        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex h-7 cursor-not-allowed items-center justify-center bg-[#1A1B1C] px-3.5 text-[9px] font-semibold uppercase leading-4 tracking-[-0.02em] text-[#FCFCFC] opacity-55 sm:text-[10px]"
        >
          Enter code
        </button>
      </div>
    </header>
  );
}
