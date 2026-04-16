"use client";

import AOS from "aos";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type TestingStep = "name" | "location";
type TestingPhase = "input" | "processing" | "complete";

const PHASE_ONE_ENDPOINT =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";
const NAME_PATTERN = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const LOCATION_PATTERN = /^[A-Za-z]+(?:[A-Za-z\s,.'-]*[A-Za-z])?$/;

function normalizeInput(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function validateStepValue(step: TestingStep, value: string) {
  const normalizedValue = normalizeInput(value);

  if (!normalizedValue) {
    return {
      valid: false,
      message:
        step === "name"
          ? "Please enter your name to continue."
          : "Please enter your location to continue.",
      normalizedValue,
    };
  }

  const pattern = step === "name" ? NAME_PATTERN : LOCATION_PATTERN;

  if (!pattern.test(normalizedValue)) {
    return {
      valid: false,
      message:
        step === "name"
          ? "Name should only include letters, spaces, apostrophes, or hyphens."
          : "Location should only include letters and standard punctuation.",
      normalizedValue,
    };
  }

  return { valid: true, message: "", normalizedValue };
}

export default function TestingPage() {
  const [step, setStep] = useState<TestingStep>("name");
  const [phase, setPhase] = useState<TestingPhase>("input");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const requestedStep = new URLSearchParams(window.location.search).get("step");
    const savedName = window.localStorage.getItem("skinstric.userName") ?? "";
    const savedLocation =
      window.localStorage.getItem("skinstric.userLocation") ?? "";

    if (savedName) {
      setName(savedName);
    }

    if (savedLocation) {
      setLocation(savedLocation);
    }

    if (requestedStep === "location") {
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
  const hasValue = normalizeInput(value).length > 0;

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

  const submitPhaseOne = async (submittedName: string, submittedLocation: string) => {
    const response = await fetch(PHASE_ONE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: submittedName,
        location: submittedLocation,
      }),
    });

    if (!response.ok) {
      throw new Error("Phase 1 submission failed.");
    }
  };

  const handleContinue = async () => {
    const validation = validateStepValue(step, value);

    if (!validation.valid) {
      setErrorMessage(validation.message);
      inputRef.current?.focus();
      return;
    }

    setErrorMessage("");

    if (step === "name") {
      setName(validation.normalizedValue);
      window.localStorage.setItem("skinstric.userName", validation.normalizedValue);
      setStep("location");
      return;
    }

    const normalizedLocation = validation.normalizedValue;
    const normalizedName = normalizeInput(name);

    setLocation(normalizedLocation);
    window.localStorage.setItem("skinstric.userLocation", normalizedLocation);
    setIsFocused(false);
    setPhase("processing");

    try {
      await submitPhaseOne(normalizedName, normalizedLocation);
    } catch {
      setPhase("input");
      setErrorMessage(
        "We couldn't save your details just yet. Please try again.",
      );
      inputRef.current?.focus();
      return;
    }
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
                  onChange={(event) => {
                    setValue(event.target.value);
                    if (errorMessage) {
                      setErrorMessage("");
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleContinue();
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

            {errorMessage ? (
              <p className="mt-3 text-center text-[0.72rem] uppercase tracking-[-0.02em] text-[#8B3A3A] sm:text-[0.78rem]">
                {errorMessage}
              </p>
            ) : null}
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

      <div className="mt-4 flex items-center justify-between gap-4 md:absolute md:bottom-8 md:left-8 md:right-8 md:mt-0 md:justify-start md:gap-0">
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
