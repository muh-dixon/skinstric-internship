"use client";

import AOS from "aos";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  normalizeBase64Image,
  STORAGE_KEYS,
  type PhaseTwoApiResponse,
} from "@/lib/analysis-content";

type CapturePhase =
  | "chooser"
  | "camera-prompt"
  | "camera-loading"
  | "camera-live"
  | "review"
  | "analysis-loading";

function CameraGlyph() {
  return (
    <div className="relative h-[8.5rem] w-[8.5rem]">
      <Image
        src="/camera-icon.png"
        alt="Camera icon"
        fill
        sizes="136px"
        className="object-contain"
        priority
      />
    </div>
  );
}

function GalleryGlyph() {
  return (
    <div className="relative h-[8.5rem] w-[8.5rem]">
      <Image
        src="/gallery-icon.png"
        alt="Gallery icon"
        fill
        sizes="136px"
        className="object-contain"
        priority
      />
    </div>
  );
}

function CameraButtonGlyph() {
  return (
    <div className="flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-full border-[2px] border-white bg-white/10 backdrop-blur">
      <div className="flex h-[3.3rem] w-[3.3rem] items-center justify-center rounded-full border-[2px] border-white bg-white">
        <div className="relative h-[1.2rem] w-[1.5rem] rounded-[0.35rem] border-2 border-[#A0A4AB]">
          <div className="absolute -top-[0.25rem] left-1/2 h-[0.35rem] w-[0.55rem] -translate-x-1/2 rounded-t-[0.2rem] bg-[#A0A4AB]" />
          <div className="absolute left-1/2 top-1/2 h-[0.55rem] w-[0.55rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#A0A4AB]" />
        </div>
      </div>
    </div>
  );
}

function SpiralOption({
  label,
  direction,
  children,
  onClick,
}: {
  label: string;
  direction: "left" | "right";
  children: React.ReactNode;
  onClick: () => void;
}) {
  const isLeft = direction === "left";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-[16.5rem] w-full max-w-[21rem] items-center justify-center text-left transition-transform duration-300 ease-out hover:-translate-y-1 sm:h-[19rem] sm:max-w-[26rem] lg:left-[3rem] lg:h-[23rem] lg:max-w-[31rem] xl:left-[6.5rem] xl:h-[24rem] xl:max-w-[30rem]"
    >
      <div
        className={`pointer-events-none absolute top-1/2 h-[13rem] w-[13rem] -translate-y-1/2 sm:h-[16rem] sm:w-[16rem] lg:h-[18.5rem] lg:w-[18.5rem] xl:h-[19.25rem] xl:w-[19.25rem] ${
          isLeft
            ? "left-1/2 -translate-x-1/2 lg:left-[2.1rem] lg:translate-x-0 xl:left-[2.4rem]"
            : "left-1/2 -translate-x-1/2 lg:left-auto lg:right-[1.15rem] lg:translate-x-0 xl:right-[1.35rem]"
        }`}
      >
        <div className="absolute inset-0 spiral-square-a border border-dashed border-[#A0A4AB]/18 transition-colors duration-300 ease-out group-hover:border-[#8F949B]/32" />
        <div className="absolute inset-[6%] spiral-square-b border border-dashed border-[#A0A4AB]/26 transition-colors duration-300 ease-out group-hover:border-[#8F949B]/42" />
        <div className="absolute inset-[12%] spiral-square-c border border-dashed border-[#A0A4AB]/34 transition-colors duration-300 ease-out group-hover:border-[#8F949B]/54" />
        <div className="absolute inset-[18%] spiral-square-d border border-dashed border-[#A0A4AB]/42 transition-colors duration-300 ease-out group-hover:border-[#8F949B]/70" />

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out group-hover:scale-[1.04]">
          {children}
        </div>
      </div>

      <div
        className={`absolute z-10 flex items-center gap-2.5 sm:gap-3 ${
          isLeft
            ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-6 lg:bottom-auto lg:left-[15.55rem] lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 xl:left-[15.9rem]"
            : "bottom-0 left-1/2 -translate-x-1/2 translate-y-6 lg:bottom-auto lg:left-auto lg:right-[13.65rem] lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 xl:right-[14.9rem]"
        }`}
      >
        {isLeft ? (
          <>
            <div className="relative h-[42px] w-[46px] shrink-0 rotate-[200deg] transition-transform duration-300 ease-out group-hover:scale-[1.02] sm:h-[52px] sm:w-[58px] lg:mt-[0.15rem] lg:h-[59px] lg:w-[66px]">
              <Image
                src="/Union.png"
                alt="Connector callout"
                fill
                sizes="66px"
                className="pointer-events-none object-contain transition-opacity duration-300 ease-out group-hover:opacity-85"
              />
            </div>

            <div className="flex flex-col items-start gap-[0.1rem] text-left text-[clamp(0.78rem,3vw,1.75rem)] font-light uppercase leading-[1.15] tracking-[-0.04em] text-[#1A1B1C] transition-transform duration-300 ease-out group-hover:translate-x-0.5 sm:pt-[0.15rem]">
              {label.split("|").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-end gap-[0.1rem] text-right text-[clamp(0.78rem,3vw,1.75rem)] font-light uppercase leading-[1.15] tracking-[-0.04em] text-[#1A1B1C] transition-transform duration-300 ease-out group-hover:-translate-x-0.5 sm:pt-[0.15rem]">
              {label.split("|").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>

            <div className="relative h-[42px] w-[46px] shrink-0 rotate-[20deg] transition-transform duration-300 ease-out group-hover:scale-[1.02] sm:h-[52px] sm:w-[58px] lg:mt-[0.1rem] lg:h-[59px] lg:w-[66px]">
              <Image
                src="/Union.png"
                alt="Connector callout"
                fill
                sizes="66px"
                className="pointer-events-none object-contain transition-opacity duration-300 ease-out group-hover:opacity-85"
              />
            </div>
          </>
        )}
      </div>
    </button>
  );
}

export default function CapturePage() {
  const [phase, setPhase] = useState<CapturePhase>("chooser");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState("Preview");
  const [analysisReady, setAnalysisReady] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingTimeoutRef = useRef<number | null>(null);
  const analysisRequestRef = useRef<AbortController | null>(null);

  function stopCamera() {
    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
      analysisRequestRef.current?.abort();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (phase !== "camera-live" || !videoRef.current || !streamRef.current) {
      return;
    }

    const video = videoRef.current;
    video.srcObject = streamRef.current;

    const startPlayback = async () => {
      try {
        await video.play();
      } catch {
        setErrorMessage("Camera preview could not start.");
        stopCamera();
        setPhase("chooser");
      }
    };

    const onLoadedMetadata = () => {
      void startPlayback();
    };

    if (video.readyState >= 1) {
      void startPlayback();
    } else {
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [phase]);

  useEffect(() => {
    AOS.refreshHard();
  }, [phase, capturedPhoto]);

  useEffect(() => {
    if (phase !== "analysis-loading" || !analysisReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      router.push("/results");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [analysisReady, phase, router]);

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      setPhase("camera-loading");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      loadingTimeoutRef.current = window.setTimeout(() => {
        setPhase("camera-live");
      }, 1100);
    } catch {
      setErrorMessage("Camera access was blocked or unavailable.");
      setPhase("chooser");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedPhoto(dataUrl);
    setPreviewLabel("Great shot!");
    stopCamera();
    setPhase("review");
  };

  const handleGalleryPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCapturedPhoto(reader.result);
        setPreviewLabel("Preview");
        setPhase("review");
      }
    };
    reader.readAsDataURL(file);
  };

  const submitPhaseTwoAnalysis = async () => {
    if (!capturedPhoto) {
      return;
    }

    analysisRequestRef.current?.abort();
    const controller = new AbortController();
    analysisRequestRef.current = controller;

    setAnalysisReady(false);
    setErrorMessage(null);
    setPhase("analysis-loading");

    try {
      const response = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: normalizeBase64Image(capturedPhoto),
          }),
          signal: controller.signal,
        },
      );

      const payload = (await response.json()) as PhaseTwoApiResponse;

      if (!response.ok || !payload.data) {
        throw new Error("Phase 2 analysis request failed.");
      }

      window.localStorage.setItem(
        STORAGE_KEYS.phaseTwoResult,
        JSON.stringify(payload.data),
      );
      setAnalysisReady(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setErrorMessage(
        "We couldn't prepare your analysis just yet. Please try the photo again.",
      );
      setPhase("review");
    }
  };

  const handleBack = () => {
    if (phase === "chooser") {
      router.push("/testing?step=location");
      return;
    }

    if (phase === "camera-live") {
      stopCamera();
      setPhase("chooser");
      return;
    }

    if (phase === "camera-prompt" || phase === "camera-loading") {
      setPhase("chooser");
      return;
    }

    if (phase === "review") {
      setCapturedPhoto(null);
      setPhase("chooser");
      return;
    }

    if (phase === "analysis-loading") {
      analysisRequestRef.current?.abort();
      setAnalysisReady(false);
      setPhase("review");
      return;
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-background">
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGalleryPick}
      />

      {phase === "chooser" ? (
        <section className="relative min-h-[calc(100vh-56px)] px-4 py-5 sm:px-6 xl:px-8">
          <div className="flex items-start justify-between gap-4 sm:gap-6">
            <p
              data-aos="fade-down"
              data-aos-duration="900"
              className="text-[0.85rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] sm:text-[1rem] md:text-[1.1rem]"
            >
              To start analysis
            </p>
            <div
              data-aos="fade-left"
              data-aos-duration="1000"
              className="hidden min-w-[8.5rem] items-start gap-3 lg:flex xl:min-w-[9.5rem]"
            >
              <div className="text-[clamp(1rem,1.15vw,1.3rem)] font-light tracking-[-0.04em] text-[#777]">
                Preview
              </div>
              <div className="h-[7.25rem] w-[7.25rem] border border-[#CFCFCF] xl:h-[8rem] xl:w-[8rem]" />
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-[92rem] gap-16 sm:mt-12 sm:gap-20 lg:mt-8 lg:grid-cols-2 lg:gap-8 xl:mt-9 xl:gap-10">
            <div data-aos="fade-right" data-aos-duration="1100">
              <SpiralOption
                label="ALLOW A.I.|TO SCAN YOUR FACE"
                direction="left"
                onClick={() => setPhase("camera-prompt")}
              >
                <CameraGlyph />
              </SpiralOption>
            </div>

            <div data-aos="fade-left" data-aos-duration="1100" data-aos-delay="100">
              <SpiralOption
                label="ALLOW A.I.|ACCESS GALLERY"
                direction="right"
                onClick={() => fileInputRef.current?.click()}
              >
                <GalleryGlyph />
              </SpiralOption>
            </div>
          </div>

          {errorMessage ? (
            <p className="mt-8 text-center text-sm uppercase tracking-[-0.03em] text-[#7A3A3A]">
              {errorMessage}
            </p>
          ) : null}

          <button
            data-aos="fade-right"
            data-aos-duration="900"
            type="button"
            onClick={handleBack}
            className="mt-14 inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] transition-all duration-300 ease-out hover:text-black/70 sm:gap-4 sm:text-[0.95rem] lg:absolute lg:bottom-8 lg:left-8 lg:mt-0 lg:gap-5 lg:text-[clamp(1rem,1.2vw,1.5rem)]"
          >
            <span className="flex h-[2.4rem] w-[2.4rem] items-center justify-center border border-black/70 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-black lg:h-[3rem] lg:w-[3rem]">
              <span className="-rotate-45 text-[0.9rem] leading-none lg:text-[1.1rem]">&#9664;</span>
            </span>
            <span>Back</span>
          </button>
        </section>
      ) : null}

      {phase === "camera-prompt" ? (
        <section className="relative min-h-[calc(100vh-56px)] px-4 py-5 sm:px-6 xl:px-8">
          <div className="flex items-start justify-between gap-4 sm:gap-6">
            <p className="text-[clamp(1rem,1vw,1.25rem)] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C]">
              To start analysis
            </p>
            <div className="hidden min-w-[8.5rem] items-start gap-3 lg:flex xl:min-w-[9.5rem]">
              <div className="text-[clamp(1rem,1.15vw,1.3rem)] font-light tracking-[-0.04em] text-[#777]">
                Preview
              </div>
              <div className="h-[7.25rem] w-[7.25rem] border border-[#CFCFCF] xl:h-[8rem] xl:w-[8rem]" />
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-[92rem] gap-16 opacity-55 sm:mt-12 sm:gap-20 lg:mt-8 lg:grid-cols-2 lg:gap-8 xl:mt-9 xl:gap-10">
            <div>
              <SpiralOption
                label="ALLOW A.I.|TO SCAN YOUR FACE"
                direction="left"
                onClick={() => {}}
              >
                <CameraGlyph />
              </SpiralOption>
            </div>

            <div>
              <SpiralOption
                label="ALLOW A.I.|ACCESS GALLERY"
                direction="right"
                onClick={() => {}}
              >
                <GalleryGlyph />
              </SpiralOption>
            </div>
          </div>

          <div
            data-aos="zoom-in"
            data-aos-duration="1400"
            data-aos-easing="ease-out-cubic"
            className="absolute left-4 right-4 top-[12.5rem] z-20 w-auto max-w-[26.5rem] bg-[#1A1B1C] text-white shadow-xl sm:left-1/2 sm:right-auto sm:w-full sm:-translate-x-1/2 lg:left-[20rem] lg:right-auto lg:top-[14.6rem] lg:translate-x-0 xl:left-[21.25rem] xl:top-[14.85rem] xl:max-w-[27rem]"
          >
            <div className="px-5 py-4 text-[clamp(1rem,1.08vw,1.18rem)] font-semibold uppercase tracking-[-0.03em]">
              Allow A.I. to access your camera
            </div>
            <div className="flex items-center justify-end gap-10 border-t border-white/50 px-5 py-2.5 text-[clamp(0.92rem,0.96vw,1.02rem)] font-semibold uppercase tracking-[-0.03em]">
              <button
                type="button"
                onClick={() => setPhase("chooser")}
                className="text-white/75 transition-colors duration-300 ease-out hover:text-white"
              >
                Deny
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="transition-colors duration-300 ease-out hover:text-white/80"
              >
                Allow
              </button>
            </div>
          </div>

          <button
            data-aos="fade-right"
            data-aos-duration="900"
            type="button"
            onClick={handleBack}
            className="mt-14 inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] transition-all duration-300 ease-out hover:text-black/70 sm:gap-4 sm:text-[0.95rem] lg:absolute lg:bottom-8 lg:left-8 lg:mt-0 lg:gap-5 lg:text-[clamp(1rem,1.2vw,1.5rem)]"
          >
            <span className="flex h-[2.4rem] w-[2.4rem] items-center justify-center border border-black/70 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-black lg:h-[3rem] lg:w-[3rem]">
              <span className="-rotate-45 text-[0.9rem] leading-none lg:text-[1.1rem]">&#9664;</span>
            </span>
            <span>Back</span>
          </button>
        </section>
      ) : null}

      {phase === "camera-loading" ? (
        <section className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-6 text-center sm:px-6 md:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 sm:h-[18rem] sm:w-[18rem] lg:h-[22rem] lg:w-[22rem]">
            <div className="absolute inset-0 border border-dashed border-[#A0A4AB]/22 rotate-[6deg]" />
            <div className="absolute inset-[6%] border border-dashed border-[#A0A4AB]/28 rotate-[-5deg]" />
            <div className="absolute inset-[12%] border border-dashed border-[#A0A4AB]/34 rotate-[4deg]" />
          </div>

          <div
            data-aos="zoom-in"
            data-aos-duration="1000"
            className="relative z-10 flex flex-col items-center"
          >
            <CameraGlyph />
            <p className="mt-5 text-[clamp(1rem,5vw,2rem)] font-semibold uppercase tracking-[-0.04em] text-[#9A9A9A]">
              Setting up camera...
            </p>

            <p className="mt-12 text-[clamp(0.82rem,3.8vw,1.3rem)] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C] sm:mt-16 lg:mt-20">
              To get better results make sure to have
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[clamp(0.72rem,3vw,1.2rem)] font-medium uppercase tracking-[-0.03em] text-[#1A1B1C] sm:mt-7 sm:gap-6 lg:mt-8 lg:gap-8">
              <span>&#9671; Neutral expression</span>
              <span>&#9671; Frontal pose</span>
              <span>&#9671; Adequate lighting</span>
            </div>
            <div className="mt-6 flex w-full max-w-[20rem] items-center gap-2 sm:max-w-[28rem] sm:gap-3 lg:mt-8 lg:max-w-[38rem]">
              <span className="text-[#8D8D8D]">&#9664;</span>
              <div className="h-[0.55rem] flex-1 rounded-full bg-[#8D8D8D] sm:h-[0.65rem] lg:h-[0.75rem]" />
              <span className="text-[#8D8D8D]">&#9654;</span>
            </div>
          </div>
        </section>
      ) : null}

      {phase === "camera-live" ? (
        <section className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="h-[calc(100vh-56px)] w-full object-cover scale-x-[-1]"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.18)_100%)]" />

          <div
            data-aos="fade-right"
            data-aos-duration="900"
            className="absolute bottom-5 left-4 z-10 flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[-0.03em] text-white sm:bottom-6 sm:left-6 sm:text-[0.95rem] lg:bottom-8 lg:left-8 lg:gap-5 lg:text-[clamp(1rem,1.2vw,1.5rem)]"
          >
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-5 transition-all duration-300 ease-out hover:text-white/75"
            >
              <span className="flex h-[2.4rem] w-[2.4rem] items-center justify-center border border-white/80 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-white sm:h-[2.7rem] sm:w-[2.7rem] lg:h-[3rem] lg:w-[3rem]">
                <span className="-rotate-45 text-[0.9rem] leading-none sm:text-[1rem] lg:text-[1.1rem]">&#9664;</span>
              </span>
              <span>Back</span>
            </button>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            className="absolute bottom-24 left-1/2 z-10 flex w-full max-w-[42rem] -translate-x-1/2 flex-col items-center px-4 text-center text-white sm:bottom-28 sm:px-6 lg:bottom-36"
          >
            <p className="text-[clamp(0.8rem,3vw,1.3rem)] font-semibold uppercase tracking-[-0.03em]">
              To get better results make sure to have
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[clamp(0.68rem,2.6vw,1.1rem)] font-medium uppercase tracking-[-0.03em] sm:mt-5 sm:gap-6 lg:gap-8">
              <span>&#9671; Neutral expression</span>
              <span>&#9671; Frontal pose</span>
              <span>&#9671; Adequate lighting</span>
            </div>
          </div>

          <button
            data-aos="fade-left"
            data-aos-duration="1000"
            type="button"
            onClick={capturePhoto}
            className="absolute bottom-6 right-4 z-10 flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[-0.03em] text-white sm:bottom-8 sm:right-6 sm:text-[0.95rem] lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:gap-5 lg:text-[clamp(1rem,1.2vw,1.3rem)]"
          >
            <span>Take picture</span>
            <CameraButtonGlyph />
          </button>
        </section>
      ) : null}

      {phase === "review" && capturedPhoto ? (
        <section className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-black">
          <img
            src={capturedPhoto}
            alt="Captured preview"
            className="h-[calc(100vh-56px)] w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.22)_100%)]" />

          <div
            data-aos="fade-right"
            data-aos-duration="900"
            className="absolute bottom-5 left-4 z-10 flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[-0.03em] text-white sm:bottom-6 sm:left-6 sm:text-[0.95rem] lg:bottom-8 lg:left-8 lg:gap-5 lg:text-[clamp(1rem,1.2vw,1.5rem)]"
          >
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-5 transition-all duration-300 ease-out hover:text-white/75"
            >
              <span className="flex h-[2.4rem] w-[2.4rem] items-center justify-center border border-white/80 rotate-45 transition-all duration-300 ease-out hover:scale-[1.04] hover:border-white sm:h-[2.7rem] sm:w-[2.7rem] lg:h-[3rem] lg:w-[3rem]">
                <span className="-rotate-45 text-[0.9rem] leading-none sm:text-[1rem] lg:text-[1.1rem]">&#9664;</span>
              </span>
              <span>Back</span>
            </button>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="900"
            className="absolute left-1/2 top-[24%] z-10 -translate-x-1/2 text-center text-white sm:top-[28%] lg:top-[32%]"
          >
            <p className="text-[clamp(0.9rem,3.6vw,1.8rem)] font-semibold uppercase tracking-[-0.03em]">
              {previewLabel}
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="100"
            className="absolute bottom-10 left-1/2 z-10 flex w-[calc(100%-2rem)] max-w-[28rem] -translate-x-1/2 flex-col items-center text-white sm:bottom-12 sm:w-auto lg:bottom-16"
          >
            <p className="mb-5 text-[clamp(1.1rem,4.5vw,2rem)] font-semibold tracking-[-0.04em] sm:mb-6 lg:mb-8">
              Preview
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex h-[2.8rem] items-center justify-center bg-white px-5 text-[0.9rem] font-semibold tracking-[-0.03em] text-[#17203A] transition-all duration-300 ease-out hover:scale-[1.03] hover:bg-[#f1f1f1] sm:h-[3rem] sm:px-6 sm:text-[1rem]"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={submitPhaseTwoAnalysis}
                className="inline-flex h-[2.8rem] items-center justify-center bg-[#1A1B1C] px-6 text-[0.9rem] font-semibold tracking-[-0.03em] text-white transition-all duration-300 ease-out hover:scale-[1.03] hover:bg-black sm:h-[3rem] sm:px-8 sm:text-[1rem]"
              >
                Use This Photo
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {phase === "analysis-loading" ? (
        <section className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden bg-background px-5 py-6 text-center sm:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(16rem,28vw,24rem)] w-[clamp(16rem,28vw,24rem)] -translate-x-1/2 -translate-y-1/2">
            <div className="spiral-square-d absolute inset-0 border border-dashed border-[#A0A4AB]/18" />
            <div className="spiral-square-b absolute inset-[6%] border border-dashed border-[#A0A4AB]/24" />
            <div className="spiral-square-c absolute inset-[12%] border border-dashed border-[#A0A4AB]/32" />
            <div className="spiral-square-a absolute inset-[18%] border border-dashed border-[#A0A4AB]/40" />
          </div>

          <div
            data-aos="zoom-in"
            data-aos-duration="1100"
            className="relative z-10 flex flex-col items-center"
          >
            <p className="text-[clamp(1rem,1.2vw,1.2rem)] font-semibold uppercase tracking-[-0.03em] text-[#1A1B1C]">
              Preparing your analysis ...
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="loading-dot h-2.5 w-2.5 rounded-full bg-[#A9A9A9]" />
              <span className="loading-dot h-2.5 w-2.5 rounded-full bg-[#A9A9A9]" />
              <span className="loading-dot h-2.5 w-2.5 rounded-full bg-[#A9A9A9]" />
            </div>
            {!analysisReady ? (
              <p className="mt-5 text-[0.82rem] uppercase tracking-[-0.02em] text-[#7D7D7D]">
                Uploading image to phase 2 analysis...
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
