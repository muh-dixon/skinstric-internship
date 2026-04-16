"use client";

import AOS from "aos";
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
    const requestedStep = new URLSearchParams(window.location.search).get("step");

    if (requestedStep === "location") {
      const savedName = window.localStorage.getItem("skinstric.userName") ?? "";
      if (savedName) {
        setName(savedName);
      }
      setPhase("input");
      setStep("location");
    }
  }, []);

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

  useEffect(() => {
    AOS.refreshHard();
  }, [phase, step]);

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
    <main className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-background px-4 py-5 sm:px-6 md:px-8 md:py-6">
      <p
        data-aos="fade-down"
        data-aos-duration="900"
        className="text-[0.85rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] sm:text-[1rem] md:text-[1.1rem]"
      >
        To start analysis
      </p>

      <section className="relative mx-auto mt-6 flex min-h-[calc(100vh-13rem)] w-full max-w-[1320px] items-center justify-center md:mt-10 md:min-h-[calc(100vh-12rem)]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(13rem,68vw,24.75rem)] w-[clamp(13rem,68vw,24.75rem)] -translate-x-1/2 -translate-y-1/2">
          <div className="spiral-square-d absolute inset-0 border border-dashed border-[#A0A4AB]/28" />
          <div className="spiral-square-b absolute inset-[3%] border border-dashed border-[#A0A4AB]/33" />
          <div className="spiral-square-c absolute inset-[6%] border border-dashed border-[#A0A4AB]/38" />
          <div className="spiral-square-a absolute inset-[9%] border border-dashed border-[#A0A4AB]/45" />
        </div>

        {phase === "input" ? (
          <div
            data-aos="zoom-in"
            data-aos-duration="1100"
            className="relative z-10 flex w-full max-w-[min(570px,92vw)] flex-col items-center text-center"
          >
            <p
              className={`mb-2 text-[clamp(0.7rem,2.5vw,1.5rem)] font-light uppercase tracking-[-0.03em] transition-colors duration-300 md:mb-3 ${
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
                  className="w-full bg-transparent text-center text-[clamp(1.95rem,10vw,4.5rem)] font-light tracking-[-0.06em] text-[#8E8E8E] caret-[#1A1B1C] outline-none placeholder:text-[#8E8E8E] focus:text-[#6F6F6F]"
                />
              </div>
            </button>
          </div>
        ) : null}

        {phase === "processing" ? (
          <div
            data-aos="fade-up"
            data-aos-duration="900"
            className="relative z-10 flex flex-col items-center text-center"
          >
            <p className="text-[clamp(1.15rem,5.5vw,2.2rem)] font-light tracking-[-0.04em] text-[#667085]">
              Processing submission
            </p>
            <div className="mt-6 flex items-center gap-3 md:mt-8 md:gap-4">
              <span className="loading-dot h-2.5 w-2.5 rounded-full bg-[#BFBFBF] md:h-3 md:w-3" />
              <span className="loading-dot h-2.5 w-2.5 rounded-full bg-[#BFBFBF] md:h-3 md:w-3" />
              <span className="loading-dot h-2.5 w-2.5 rounded-full bg-[#BFBFBF] md:h-3 md:w-3" />
            </div>
          </div>
        ) : null}

        {phase === "complete" ? (
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            className="relative z-10 flex flex-col items-center text-center"
          >
            <p className="text-[clamp(1.8rem,8vw,3.2rem)] font-light tracking-[-0.05em] text-[#1A1B1C]">
              Thank you!
            </p>
            <p className="mt-3 text-[clamp(1.05rem,5vw,2rem)] font-light tracking-[-0.04em] text-[#52617B]">
              Proceed for the next step
            </p>
          </div>
        ) : null}
      </section>

      <div className="mt-4 flex items-center justify-between gap-4 md:absolute md:bottom-8 md:left-5 md:right-5 md:mt-0 md:justify-start md:gap-0 md:sm:left-8 md:sm:right-8">
        <button
          data-aos="fade-right"
          data-aos-duration="900"
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] transition-all duration-300 ease-out hover:text-black/70 sm:text-[0.95rem] md:gap-5 md:text-[clamp(1rem,1.2vw,1.5rem)]"
        >
          <span className="flex h-[2.4rem] w-[2.4rem] items-center justify-center border border-black/70 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-black md:h-[3rem] md:w-[3rem]">
            <span className="-rotate-45 text-[0.9rem] leading-none md:text-[1.1rem]">&#9664;</span>
          </span>
          <span>Back</span>
        </button>

        {phase === "complete" ? (
          <button
            data-aos="fade-left"
            data-aos-duration="900"
            type="button"
            onClick={handleProceed}
            className="inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] transition-all duration-300 ease-out hover:text-black/70 sm:text-[0.95rem] md:absolute md:right-0 md:gap-5 md:text-[clamp(1rem,1.2vw,1.5rem)]"
          >
            <span>Proceed</span>
            <span className="flex h-[2.4rem] w-[2.4rem] items-center justify-center border border-black/70 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-black md:h-[3rem] md:w-[3rem]">
              <span className="-rotate-45 text-[0.9rem] leading-none md:text-[1.1rem]">&#9654;</span>
            </span>
          </button>
        ) : <span />}
      </div>
    </main>
  );
}
