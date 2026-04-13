"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SideActionProps = {
  href: string;
  label: string;
  direction: "left" | "right";
  isActive: boolean;
  isInactive: boolean;
  onHoverChange: (side: "left" | "right" | null) => void;
};

function SideAction({
  href,
  label,
  direction,
  isActive,
  isInactive,
  onHoverChange,
}: SideActionProps) {
  const isLeft = direction === "left";
  const hoverTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const queueHoverChange = (side: "left" | "right" | null) => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      onHoverChange(side);
    }, side ? 90 : 110);
  };

  return (
    <div
      className={`absolute top-[11rem] z-30 hidden h-[37.625rem] w-[37.625rem] lg:block ${
        isLeft ? "left-[-21.5rem]" : "right-[-21.5rem]"
      } transition-all duration-[1450ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform ${
        isActive
          ? isLeft
            ? "translate-x-[1rem] opacity-100"
            : "-translate-x-[1rem] opacity-100"
          : isInactive
            ? isLeft
              ? "pointer-events-none -translate-x-[11rem] opacity-0"
              : "pointer-events-none translate-x-[11rem] opacity-0"
            : "translate-x-0 opacity-100"
      }`}
    >
      <div
        className={`absolute inset-0 rotate-45 border border-dashed border-[#A0A4AB]/35 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isInactive ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        className={`absolute top-1/2 z-10 flex h-11 w-[9.375rem] -translate-y-1/2 items-center gap-4 text-[10px] font-medium uppercase tracking-[-0.02em] text-black/70 transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform ${
          isLeft
            ? "left-[calc(100%-4.5rem)]"
            : "right-[calc(100%-4.5rem)] justify-end"
        }`}
      >
        {isLeft ? (
          <>
            <div
              className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center"
              onMouseEnter={() => queueHoverChange(direction)}
              onMouseLeave={() => queueHoverChange(null)}
            >
              <Link
                href={href}
                className="flex h-11 w-11 items-center justify-center border border-black/70 bg-background rotate-45"
              >
                <span className="-rotate-45 text-[12px] leading-none">
                  &#9654;
                </span>
              </Link>
            </div>
            <span className="flex h-4 w-[90px] items-center">{label}</span>
          </>
        ) : (
          <>
            <span className="flex h-4 w-[90px] items-center justify-end">
              {label}
            </span>
            <div
              className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center"
              onMouseEnter={() => queueHoverChange(direction)}
              onMouseLeave={() => queueHoverChange(null)}
            >
              <Link
                href={href}
                className="flex h-11 w-11 items-center justify-center border border-black/70 bg-background rotate-45"
              >
                <span className="-rotate-45 text-[12px] leading-none">
                  &#9654;
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTitleVisible(true);
    }, 160);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-background">
      <SideAction
        href="/results"
        label="Discover A.I."
        direction="left"
        isActive={hoveredSide === "left"}
        isInactive={hoveredSide === "right"}
        onHoverChange={setHoveredSide}
      />
      <SideAction
        href="/testing"
        label="Take Test"
        direction="right"
        isActive={hoveredSide === "right"}
        isInactive={hoveredSide === "left"}
        onHoverChange={setHoveredSide}
      />

      <section className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-12 sm:px-8">
        <div
          className={`flex max-w-[42.5rem] flex-col items-center text-center transition-all duration-[1850ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform lg:absolute lg:top-[22.5625rem] lg:w-[42.5rem] lg:-translate-y-1/2 ${
            hoveredSide === "right"
              ? "lg:left-[12%] lg:items-start lg:text-left"
              : hoveredSide === "left"
                ? "lg:right-[12%] lg:items-end lg:text-right"
                : "lg:left-1/2 lg:-translate-x-1/2"
          } ${titleVisible ? "opacity-100" : "opacity-0"}`}
        >
          <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.94] tracking-[-0.07em] text-[#1A1B1C] transition-opacity duration-[2200ms] ease-[cubic-bezier(0.19,1,0.22,1)] lg:w-[42.5rem] lg:text-[128px] lg:leading-[120px]">
            Sophisticated
            <br />
            skincare
          </h1>

        </div>

        <div className="absolute bottom-5 left-5 max-w-[17rem] text-[10px] uppercase leading-[1.6] tracking-[-0.02em] text-[#1A1B1C] sm:bottom-6 sm:left-8 lg:bottom-4 lg:left-5">
          <p>Skinstric developed an A.I. that creates</p>
          <p>a highly-personalized routine tailored to</p>
          <p>what your skin needs.</p>
        </div>

        <div className="absolute inset-x-2 bottom-20 flex items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-[-0.02em] text-black/70 sm:inset-x-4 lg:hidden">
          <Link
            href="/results"
            className="flex h-11 min-w-0 items-center gap-3"
            onMouseEnter={() => setHoveredSide("left")}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/70 rotate-45">
              <span className="-rotate-45 text-[16px] leading-none">
                &rsaquo;
              </span>
            </span>
            <span className="truncate">Discover A.I.</span>
          </Link>

          <Link
            href="/testing"
            className="flex h-11 min-w-0 items-center justify-end gap-3 text-right"
            onMouseEnter={() => setHoveredSide("right")}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <span className="truncate">Take Test</span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/70 rotate-45">
              <span className="-rotate-45 text-[16px] leading-none">
                &lsaquo;
              </span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
