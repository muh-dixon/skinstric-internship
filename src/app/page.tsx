"use client";

import Link from "next/link";
import { motion } from "motion/react";
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
    }, side ? 150 : 210);
  };

  return (
      <div
        className={`absolute top-[11rem] z-30 hidden h-[37.625rem] w-[37.625rem] lg:block ${
        isLeft ? "left-[-21.5rem]" : "right-[-21.5rem]"
      } transition-[transform,opacity] duration-[2800ms] ease-[cubic-bezier(0.16,0.92,0.24,1)] will-change-transform ${
        isActive
          ? isLeft
            ? "translate-x-[0.4rem] opacity-100"
            : "-translate-x-[0.4rem] opacity-100"
          : isInactive
            ? isLeft
              ? "pointer-events-none -translate-x-[7.5rem] opacity-0"
              : "pointer-events-none translate-x-[7.5rem] opacity-0"
            : "translate-x-0 opacity-100"
      }`}
    >
      <div
        className={`absolute inset-0 rotate-45 border border-dashed border-[#A0A4AB]/35 transition-[transform,opacity] duration-[2550ms] ease-[cubic-bezier(0.16,0.92,0.24,1)] ${
          isActive
            ? isLeft
              ? "translate-x-[0.25rem] opacity-100"
              : "-translate-x-[0.25rem] opacity-100"
            : isInactive
              ? isLeft
                ? "-translate-x-[2.25rem] opacity-0"
                : "translate-x-[2.25rem] opacity-0"
              : "translate-x-0 opacity-100"
        }`}
      />

      <div
        className={`absolute top-1/2 z-10 flex h-11 w-[9.375rem] -translate-y-1/2 items-center gap-4 text-[10px] font-medium uppercase tracking-[-0.02em] text-black/70 transition-[transform,opacity] duration-[2400ms] ease-[cubic-bezier(0.16,0.92,0.24,1)] will-change-transform ${
          isLeft
            ? "left-[calc(100%-4.5rem)]"
            : "right-[calc(100%-4.5rem)] justify-end"
        } ${
          isActive
            ? isLeft
              ? "translate-x-[0.2rem] opacity-100"
              : "-translate-x-[0.2rem] opacity-100"
            : isInactive
              ? isLeft
                ? "-translate-x-[1.85rem] opacity-0"
                : "translate-x-[1.85rem] opacity-0"
              : "translate-x-0 opacity-100"
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
  const containerX =
    hoveredSide === "right" ? -235 : hoveredSide === "left" ? 235 : 0;

  const topLineX =
    hoveredSide === "right" ? -26 : hoveredSide === "left" ? 26 : 0;
  const bottomLineX =
    hoveredSide === "right" ? -44 : hoveredSide === "left" ? 44 : 0;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTitleVisible(true);
    }, 160);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-background">
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

      <section className="relative z-10 flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-5 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, x: 0 }}
          animate={{
            opacity: titleVisible ? 1 : 0,
            y: titleVisible ? 0 : 18,
            x: containerX,
          }}
          transition={{
            opacity: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
            x:
              hoveredSide === null
                ? {
                    type: "spring",
                    stiffness: 34,
                    damping: 24,
                    mass: 1.9,
                  }
                : {
                    type: "spring",
                    stiffness: 44,
                    damping: 28,
                    mass: 1.5,
                  },
          }}
          className={`flex max-w-[42.5rem] flex-col items-center text-center will-change-transform lg:absolute lg:left-1/2 lg:top-[22.5625rem] lg:w-[42.5rem] ${
            hoveredSide === "right"
              ? "lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-start lg:text-left"
              : hoveredSide === "left"
                ? "lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-end lg:text-right"
                : "lg:-translate-x-1/2 lg:-translate-y-1/2"
          }`}
        >
          <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.94] tracking-[-0.07em] text-[#1A1B1C] lg:w-[42.5rem] lg:text-[128px] lg:leading-[120px]">
            <motion.span
              className="block will-change-transform"
              animate={{ x: topLineX }}
              transition={{
                type: "spring",
                stiffness: 44,
                damping: 26,
                mass: 1.45,
              }}
            >
              Sophisticated
            </motion.span>
            <motion.span
              className="block will-change-transform"
              animate={{ x: bottomLineX }}
              transition={{
                type: "spring",
                stiffness: 38,
                damping: 28,
                mass: 1.7,
                delay: hoveredSide ? 0.16 : 0.04,
              }}
            >
              skincare
            </motion.span>
          </h1>

        </motion.div>

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
