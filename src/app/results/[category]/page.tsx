"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  parseStoredPhaseTwoResult,
  rankBuckets,
  STORAGE_KEYS,
  type PhaseTwoData,
} from "@/lib/analysis-content";

type DemographicTab = "race" | "age" | "gender";

const TAB_LABELS: Record<DemographicTab, string> = {
  race: "Race",
  age: "Age",
  gender: "Sex",
};

const RING_RADIUS = 140;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
let cachedPhaseTwoRaw: string | null = null;
let cachedPhaseTwoSnapshot: PhaseTwoData | null = null;

function subscribeToStorage() {
  return () => {};
}

function getDemographicSnapshot() {
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

function useDemographicData() {
  return useSyncExternalStore(
    subscribeToStorage,
    getDemographicSnapshot,
    () => null,
  );
}

function DemographicsExperience({ data }: { data: PhaseTwoData }) {
  const ranked = useMemo(
    () => ({
      race: rankBuckets(data.race),
      age: rankBuckets(data.age),
      gender: rankBuckets(data.gender),
    }),
    [data],
  );

  const [activeTab, setActiveTab] = useState<DemographicTab>("race");
  const [selectedRawLabel, setSelectedRawLabel] = useState<string>(
    ranked.race[0]?.rawLabel ?? "",
  );

  const selectedList = ranked[activeTab];
  const selectedItem =
    selectedList.find((item) => item.rawLabel === selectedRawLabel) ??
    selectedList[0];
  const selectedValue = selectedItem?.value ?? 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - selectedValue);

  return (
    <main className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-background px-4 py-5 pb-10 sm:px-6 sm:py-6 sm:pb-12 lg:px-8 lg:pb-24">
      <section className="max-w-[11rem] sm:max-w-[12.5rem] lg:max-w-[15.5rem]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[-0.02em] text-[#1A1B1C] sm:text-[0.8rem] lg:text-[0.88rem]">
          A.I. Analysis
        </p>
        <h1 className="mt-1 text-[clamp(2.25rem,10vw,4rem)] font-light uppercase leading-[0.9] tracking-[-0.06em] text-[#1A1B1C]">
          Demographics
        </h1>
        <p className="mt-1 text-[0.68rem] font-normal uppercase tracking-[-0.02em] text-[#1A1B1C] sm:text-[0.74rem] lg:text-[0.8rem]">
          Predicted race & age
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:mt-9 lg:mt-10 xl:mb-10 xl:grid-cols-[13rem_minmax(0,1fr)_27rem]">
        <aside className="grid gap-2.5 sm:grid-cols-3 xl:grid-cols-1">
          {(Object.keys(TAB_LABELS) as DemographicTab[]).map((tabKey) => {
            const topItem = ranked[tabKey][0];
            const isActive = activeTab === tabKey;

            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => {
                  setActiveTab(tabKey);
                  setSelectedRawLabel(ranked[tabKey][0]?.rawLabel ?? "");
                }}
                className={`flex min-h-[5.4rem] w-full flex-col justify-between border border-[#1A1B1C] px-3 py-2.5 text-left transition-colors duration-300 ease-out sm:min-h-[6rem] sm:px-4 sm:py-3 xl:h-[6.5rem] ${
                  isActive
                    ? "bg-[#1A1B1C] text-white"
                    : "bg-[#F3F3F4] text-[#1A1B1C] hover:bg-[#ebebed]"
                }`}
              >
                <span className="text-[0.82rem] font-semibold uppercase tracking-[-0.03em] sm:text-[0.9rem] xl:text-[0.98rem]">
                  {topItem?.label ?? "N/A"}
                </span>
                <span className="text-[0.8rem] font-semibold uppercase tracking-[-0.03em] sm:text-[0.88rem] xl:text-[0.95rem]">
                  {TAB_LABELS[tabKey]}
                </span>
              </button>
            );
          })}
        </aside>

        <section className="relative min-h-[23rem] border-t border-[#1A1B1C] bg-[#F3F3F4] sm:min-h-[24rem] xl:min-h-[29.5rem]">
          <div className="flex h-full flex-col justify-between px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
            <p className="text-[clamp(1.55rem,5.6vw,2.5rem)] font-light tracking-[-0.05em] text-[#1A1B1C]">
              {selectedItem?.label ?? "No data"}
            </p>

            <div className="flex justify-center pb-1 sm:pb-2 xl:justify-end xl:pr-3">
              <div className="relative flex h-[12.5rem] w-[12.5rem] items-center justify-center sm:h-[14.5rem] sm:w-[14.5rem] lg:h-[16rem] lg:w-[16rem] xl:h-[17.75rem] xl:w-[17.75rem]">
                <svg
                  viewBox="0 0 320 320"
                  className="absolute inset-0 h-full w-full -rotate-90"
                >
                  <circle
                    cx="160"
                    cy="160"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#D0D0D0"
                    strokeWidth="7"
                  />
                  <motion.circle
                    cx="160"
                    cy="160"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#1A1B1C"
                    strokeWidth="7"
                    strokeLinecap="butt"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    animate={{ strokeDashoffset: dashOffset }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 22,
                      mass: 1.1,
                    }}
                  />
                </svg>

                <motion.div
                  key={`${activeTab}-${selectedItem?.rawLabel ?? "empty"}`}
                  initial={{ opacity: 0.3, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[1.5rem] font-light tracking-[-0.05em] text-[#1A1B1C] sm:text-[1.7rem] lg:text-[1.9rem] xl:text-[2.1rem]"
                >
                  {selectedItem ? `${(selectedItem.value * 100).toFixed(2)}%` : "0%"}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-[23rem] bg-[#F3F3F4] sm:min-h-[24rem] xl:min-h-[29.5rem]">
          <div className="flex items-center justify-between border-t border-[#1A1B1C] px-3 py-2.5 text-[0.8rem] font-medium uppercase tracking-[-0.02em] text-[#1A1B1C]/80 sm:px-4 sm:py-3 sm:text-[0.9rem] xl:text-[0.95rem]">
            <span>{TAB_LABELS[activeTab]}</span>
            <span>A.I. Confidence</span>
          </div>

          <div className="space-y-1 px-0 py-0">
            {selectedList.map((item) => {
              const isSelected = item.rawLabel === selectedItem?.rawLabel;

              return (
                <button
                  key={`${activeTab}-${item.rawLabel}`}
                  type="button"
                  onClick={() => setSelectedRawLabel(item.rawLabel)}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors duration-250 ease-out sm:px-4 sm:py-3 ${
                    isSelected
                      ? "bg-[#1A1B1C] text-white"
                      : "text-[#1A1B1C] hover:bg-[#ececef]"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-[0.82rem] tracking-[-0.02em] sm:gap-3 sm:text-[0.9rem] xl:text-[0.95rem]">
                    <span className="text-[0.66rem] sm:text-[0.75rem]">&#9671;</span>
                    <span>{item.label}</span>
                  </span>
                  <span className="text-[0.82rem] font-semibold tracking-[-0.02em] sm:text-[0.9rem] xl:text-[0.95rem]">
                    {item.percent}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </section>

      <p className="mt-4 text-center text-[0.72rem] tracking-[-0.02em] text-[#9BA3B1] sm:text-[0.78rem] xl:text-[0.82rem]">
        If A.I. estimate is wrong, select the correct one.
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 sm:mt-8 xl:absolute xl:bottom-9 xl:left-7 xl:right-7 xl:mt-0">
        <Link
          href="/results"
          className="inline-flex items-center gap-2.5 text-[0.78rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] transition-all duration-300 ease-out hover:text-black/70 sm:gap-3 sm:text-[0.85rem] xl:text-[0.9rem]"
        >
          <span className="flex h-[2.1rem] w-[2.1rem] items-center justify-center border border-black/70 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-black sm:h-[2.25rem] sm:w-[2.25rem] xl:h-[2.45rem] xl:w-[2.45rem]">
            <span className="-rotate-45 text-[0.8rem] leading-none sm:text-[0.86rem] xl:text-[0.92rem]">&#9664;</span>
          </span>
          <span>Back</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[0.78rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] transition-all duration-300 ease-out hover:text-black/70 sm:gap-3 sm:text-[0.85rem] xl:text-[0.9rem]"
        >
          <span>Home</span>
          <span className="flex h-[2.1rem] w-[2.1rem] items-center justify-center border border-black/70 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-black sm:h-[2.25rem] sm:w-[2.25rem] xl:h-[2.45rem] xl:w-[2.45rem]">
            <span className="-rotate-45 text-[0.8rem] leading-none sm:text-[0.86rem] xl:text-[0.92rem]">&#9654;</span>
          </span>
        </Link>
      </div>
    </main>
  );
}

function UnavailableState() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-background px-6 py-10">
      <div className="max-w-xl rounded-[2rem] border border-[#D7D7D9] bg-white/80 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
          Result unavailable
        </p>
        <p className="mt-4 text-lg leading-8 text-[#1A1B1C]">
          Demographic analysis data is missing. Return to capture, submit a photo,
          and try again.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/capture"
            className="rounded-full border border-[#1A1B1C] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#1A1B1C] transition-colors duration-200 hover:bg-[#f3f3f4]"
          >
            Back to capture
          </Link>
          <Link
            href="/"
            className="rounded-full bg-[#1A1B1C] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-black"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const categorySlug = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const phaseTwoData = useDemographicData();

  if (categorySlug !== "demographics") {
    return <UnavailableState />;
  }

  if (!phaseTwoData) {
    return <UnavailableState />;
  }

  return <DemographicsExperience data={phaseTwoData} />;
}
