"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type TestingStep = "name" | "location";
type TestingPhase = "input" | "processing" | "complete";

export default function TestingPage() {
  const [step, setStep] = useState<TestingStep>("name");
  const [phase, setPhase] = useState<TestingPhase>("input");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (phase === "input") {
      inputRef.current?.focus();
    }
  }, [step, phase]);

  useEffect(() => {
    if (phase !== "processing") {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase("complete");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const value = step === "name" ? name : location;
  const setValue = step === "name" ? setName : setLocation;
  const hasValue = value.trim().length > 0;

  const stepContent =
    step === "name"
      ? {
          placeholder: "Introduce Yourself",
          ariaLabel: "Introduce yourself",
          maxLength: 28,
        }
      : {
          placeholder: "your city name",
          ariaLabel: "Your city name",
          maxLength: 32,
        };

  const handleContinue = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      inputRef.current?.focus();
      return;
    }

    if (step === "name") {
      window.localStorage.setItem("skinstric.userName", trimmedValue);
      setStep("location");
      return;
    }

    window.localStorage.setItem("skinstric.userLocation", trimmedValue);
    setIsFocused(false);
    setPhase("processing");
  };

  const handleBack = () => {
    if (phase === "complete") {
      setPhase("input");
      setStep("location");
      return;
    }

    if (phase === "processing") {
      setPhase("input");
      setStep("location");
      return;
    }

    if (step === "location") {
      setStep("name");
      return;
    }

    router.push("/");
  };

  const handleProceed = () => {
    router.push("/capture");
  };

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-background px-5 py-6 sm:px-8">
      <p className="text-[clamp(1rem,1vw,1.25rem)] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C]">
        To start analysis
      </p>

      <section className="relative mx-auto mt-10 flex min-h-[calc(100vh-12rem)] w-full max-w-[1320px] items-center justify-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(15rem,31.5vw,24.75rem)] w-[clamp(15rem,31.5vw,24.75rem)] -translate-x-1/2 -translate-y-1/2">
          <div className="spiral-square-d absolute inset-0 border border-dashed border-[#A0A4AB]/28" />
          <div className="spiral-square-b absolute inset-[3%] border border-dashed border-[#A0A4AB]/33" />
          <div className="spiral-square-c absolute inset-[6%] border border-dashed border-[#A0A4AB]/38" />
          <div className="spiral-square-a absolute inset-[9%] border border-dashed border-[#A0A4AB]/45" />
        </div>

        {phase === "input" ? (
          <div className="relative z-10 flex w-full max-w-[570px] flex-col items-center text-center">
            <p
              className={`mb-3 text-[clamp(0.75rem,1.05vw,1.5rem)] font-light uppercase tracking-[-0.03em] transition-colors duration-300 ${
                isFocused || hasValue ? "text-[#0f1011]" : "text-[#0f1011]"
              }`}
            >
              {hasValue ? "Click to edit" : "Click to type"}
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="w-full border-b border-[#1A1B1C] pb-1.5 text-center"
            >
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleContinue();
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={stepContent.maxLength}
                  placeholder={stepContent.placeholder}
                  aria-label={stepContent.ariaLabel}
                  className="w-full bg-transparent text-center text-[clamp(2.25rem,5.25vw,4.5rem)] font-light tracking-[-0.06em] text-[#8E8E8E] caret-[#1A1B1C] outline-none placeholder:text-[#8E8E8E] focus:text-[#6F6F6F]"
                />
              </div>
            </button>
          </div>
        ) : null}

        {phase === "processing" ? (
          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-[clamp(1.4rem,2vw,2.2rem)] font-light tracking-[-0.04em] text-[#667085]">
              Processing submission
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="loading-dot h-3 w-3 rounded-full bg-[#BFBFBF]" />
              <span className="loading-dot h-3 w-3 rounded-full bg-[#BFBFBF]" />
              <span className="loading-dot h-3 w-3 rounded-full bg-[#BFBFBF]" />
            </div>
          </div>
        ) : null}

        {phase === "complete" ? (
          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-[clamp(2.2rem,3vw,3.2rem)] font-light tracking-[-0.05em] text-[#1A1B1C]">
              Thank you!
            </p>
            <p className="mt-4 text-[clamp(1.35rem,1.8vw,2rem)] font-light tracking-[-0.04em] text-[#52617B]">
              Proceed for the next step
            </p>
          </div>
        ) : null}
      </section>

      <button
        type="button"
        onClick={handleBack}
        className="absolute bottom-8 left-5 inline-flex items-center gap-5 text-[clamp(1rem,1.2vw,1.5rem)] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] sm:left-8"
      >
        <span className="flex h-[3rem] w-[3rem] items-center justify-center border border-black/70 rotate-45">
          <span className="-rotate-45 text-[1.1rem] leading-none">&#9664;</span>
        </span>
        <span>Back</span>
      </button>

      {phase === "complete" ? (
        <button
          type="button"
          onClick={handleProceed}
          className="absolute bottom-8 right-5 inline-flex items-center gap-5 text-[clamp(1rem,1.2vw,1.5rem)] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] sm:right-8"
        >
          <span>Proceed</span>
          <span className="flex h-[3rem] w-[3rem] items-center justify-center border border-black/70 rotate-45">
            <span className="-rotate-45 text-[1.1rem] leading-none">&#9654;</span>
          </span>
        </button>
      ) : null}
    </main>
  );
}
