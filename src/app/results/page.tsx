"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  getAnalysisCategories,
  parseStoredPhaseTwoResult,
  STORAGE_KEYS,
  type PhaseTwoData,
} from "@/lib/analysis-content";

const cardPositions = [
  {
    slug: "demographics",
    desktop: "left-1/2 top-[7rem] -translate-x-1/2",
    mobileOrder: "md:order-1",
  },
  {
    slug: "cosmetic-concerns",
    desktop: "left-[calc(50%-7rem)] top-[14rem] -translate-x-1/2",
    mobileOrder: "md:order-2",
  },
  {
    slug: "skin-type-details",
    desktop: "left-[calc(50%+7rem)] top-[14rem] -translate-x-1/2",
    mobileOrder: "md:order-3",
  },
  {
    slug: "weather",
    desktop: "left-1/2 top-[21rem] -translate-x-1/2",
    mobileOrder: "md:order-4",
  },
];
let cachedPhaseTwoRaw: string | null = null;
let cachedPhaseTwoSnapshot: PhaseTwoData | null = null;

function subscribeToStorage() {
  return () => {};
}

function getPhaseTwoSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEYS.phaseTwoResult);

  if (raw === cachedPhaseTwoRaw) {
    return cachedPhaseTwoSnapshot;
  }

  cachedPhaseTwoRaw = raw;
  cachedPhaseTwoSnapshot = parseStoredPhaseTwoResult(raw);

  return cachedPhaseTwoSnapshot;
}

function getLocationSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEYS.userLocation);
}

export default function ResultsPage() {
  const [isDemographicsHovered, setIsDemographicsHovered] = useState(false);
  const phaseTwoData = useSyncExternalStore(
    subscribeToStorage,
    getPhaseTwoSnapshot,
    () => null,
  );
  const location = useSyncExternalStore(
    subscribeToStorage,
    getLocationSnapshot,
    () => null,
  );
  const analysisCategories = useMemo(
    () => getAnalysisCategories({ phaseTwoData, location }),
    [phaseTwoData, location],
  );

  const cards = cardPositions
    .map((position) => ({
      ...position,
      category: analysisCategories.find((item) => item.slug === position.slug),
    }))
    .filter(
      (
        item,
      ): item is typeof item & {
        category: (typeof analysisCategories)[number];
      } => Boolean(item.category),
    );

  return (
    <main className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-background px-7 py-5">
      <section className="max-w-[16.5rem]">
        <p className="text-[1.02rem] font-semibold uppercase tracking-[-0.02em] text-[#1A1B1C]">
          A.I Analysis
        </p>
        <div className="mt-1 space-y-0.5 text-[0.76rem] font-normal uppercase leading-[1.55] tracking-[-0.02em] text-[#1A1B1C]">
          <p>A.I. has estimated the following.</p>
          <p>Fix estimated information if needed.</p>
        </div>
      </section>

      <section className="relative mx-auto -mt-1 min-h-[35rem] w-full max-w-[62rem] pb-10">
        <div className="grid gap-6 md:hidden">
          {cards.map(({ category, mobileOrder }) => (
            category.slug === "demographics" ? (
            <Link
              key={category.slug}
              href={`/results/${category.slug}`}
              className={`group relative flex min-h-[9rem] items-center justify-center overflow-hidden bg-[#F3F3F4] px-6 py-8 text-center transition-all duration-300 ease-out hover:bg-[#e9e9eb] ${mobileOrder}`}
            >
              <span className="text-[1.15rem] font-semibold uppercase leading-[1.4] tracking-[-0.02em] text-[#1A1B1C]">
                {category.title}
              </span>
            </Link>
            ) : (
              <div
                key={category.slug}
                className={`relative flex min-h-[9rem] items-center justify-center overflow-hidden bg-[#F3F3F4] px-6 py-8 text-center opacity-72 ${mobileOrder}`}
              >
                <span className="text-[1.15rem] font-semibold uppercase leading-[1.4] tracking-[-0.02em] text-[#1A1B1C]">
                  {category.title}
                </span>
              </div>
            )
          ))}
        </div>

        <div className="relative mx-auto hidden h-[33rem] w-[33rem] md:block">
          <div
            className={`pointer-events-none absolute left-1/2 top-[18.8125rem] z-0 h-[22.4rem] w-[22.4rem] -translate-x-1/2 -translate-y-1/2 rotate-45 transition-all duration-300 ease-out ${
              isDemographicsHovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-[0.985]"
            }`}
          >
            <div className="h-full w-full border-2 border-dashed border-[#A0A4AB]/65" />
          </div>
          {cards.map(({ category, desktop }) => (
            category.slug === "demographics" ? (
              <Link
                key={category.slug}
                href={`/results/${category.slug}`}
                onMouseEnter={() => setIsDemographicsHovered(true)}
                onMouseLeave={() => setIsDemographicsHovered(false)}
                className={`absolute ${desktop} z-10 flex h-[9.625rem] w-[9.625rem] -rotate-45 items-center justify-center bg-[#F3F3F4] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#E1E1E2]`}
              >
                <span className="max-w-[8rem] rotate-45 text-center text-[1rem] font-semibold uppercase leading-[1.5] tracking-[-0.02em] text-[#1A1B1C]">
                  {category.title}
                </span>
              </Link>
            ) : (
              <div
                key={category.slug}
                className={`absolute ${desktop} flex h-[9.625rem] w-[9.625rem] -rotate-45 items-center justify-center bg-[#F3F3F4] opacity-78`}
              >
                <span className="max-w-[8rem] rotate-45 text-center text-[1rem] font-semibold uppercase leading-[1.5] tracking-[-0.02em] text-[#1A1B1C]">
                  {category.title}
                </span>
              </div>
            )
          ))}
        </div>
      </section>

      <Link
        href="/capture"
        className="absolute bottom-6 left-7 inline-flex items-center gap-3 text-[0.95rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] transition-all duration-300 ease-out hover:text-black/70"
      >
        <span className="flex h-[2.45rem] w-[2.45rem] items-center justify-center border border-black/70 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-black">
          <span className="-rotate-45 text-[0.92rem] leading-none">&#9664;</span>
        </span>
        <span>Back</span>
      </Link>

      <Link
        href="/results/demographics"
        className="absolute bottom-6 right-7 inline-flex items-center gap-3 text-[0.95rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] transition-all duration-300 ease-out hover:text-black/70"
      >
        <span>Get Summary</span>
        <span className="flex h-[2.45rem] w-[2.45rem] items-center justify-center border border-black/70 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-black">
          <span className="-rotate-45 text-[0.92rem] leading-none">&#9654;</span>
        </span>
      </Link>
    </main>
  );
}
