"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const STATUS_MESSAGES = [
  "Initializing blockchain...",
  "Loading credentials...",
  "Connecting to Solana...",
  "Verifying certificates...",
  "Almost ready...",
  "Welcome to EduChainX",
];

const MIN_DISPLAY_MS = 3000;
const STATUS_INTERVAL_MS = 600;
const FADE_DURATION_MS = 700;

/** Full-screen branded loading overlay shown during page transitions. */
export function PageLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = React.useState<"loading" | "fading" | "done">("loading");
  const [statusIndex, setStatusIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const startFadeOut = React.useCallback(() => {
    setPhase("fading");
    setTimeout(() => setPhase("done"), FADE_DURATION_MS);
  }, []);

  React.useEffect(() => {
    let mounted = true;
    const startTime = Date.now();

    const statusInterval = setInterval(() => {
      setStatusIndex((i) => (i < STATUS_MESSAGES.length - 1 ? i + 1 : i));
    }, STATUS_INTERVAL_MS);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / MIN_DISPLAY_MS) * 100, 100));
    }, 30);

    const triggerFadeOut = () => {
      if (!mounted) return;
      const remaining = Math.max(0, MIN_DISPLAY_MS - (Date.now() - startTime));
      setTimeout(() => {
        if (mounted) {
          setProgress(100);
          startFadeOut();
          setIsInitialLoad(false);
        }
      }, remaining);
    };

    const handleReadyState = () => {
      if (document.readyState === "complete") triggerFadeOut();
    };

    if (document.readyState === "complete") {
      triggerFadeOut();
    } else {
      document.addEventListener("readystatechange", handleReadyState);
    }

    return () => {
      mounted = false;
      clearInterval(statusInterval);
      clearInterval(progressInterval);
      document.removeEventListener("readystatechange", handleReadyState);
    };
  }, [startFadeOut]);

  React.useEffect(() => {
    if (isInitialLoad) return;

    setPhase("loading");
    setStatusIndex(0);
    setProgress(0);

    let mounted = true;
    const startTime = Date.now();

    const statusInterval = setInterval(() => {
      setStatusIndex((i) => (i < STATUS_MESSAGES.length - 1 ? i + 1 : i));
    }, STATUS_INTERVAL_MS);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / MIN_DISPLAY_MS) * 100, 100));
    }, 30);

    const timeout = setTimeout(() => {
      if (mounted) {
        setProgress(100);
        startFadeOut();
      }
    }, MIN_DISPLAY_MS);

    return () => {
      mounted = false;
      clearInterval(statusInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [pathname, isInitialLoad, startFadeOut]);

  React.useEffect(() => {
    if (phase !== "done") {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "#111111" }}
      aria-live="polite"
      aria-label="Loading EduChainX"
      role="status"
    >
      <Corner position="top-left" />
      <Corner position="top-right" />
      <Corner position="bottom-left" />
      <Corner position="bottom-right" />

      <NodeDot position="top-left" />
      <NodeDot position="top-right" />
      <NodeDot position="bottom-left" />
      <NodeDot position="bottom-right" />

      <div className="flex flex-col items-center gap-4 sm:gap-6 px-6">
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute w-40 h-40 rounded-full animate-pulse-glow" />
          <div className="absolute w-28 h-28 rounded-full border-2 border-transparent border-t-[#E85E1D] border-r-[#E85E1D] animate-spin-slow" />
          <div className="absolute w-24 h-24 rounded-full border-2 border-transparent border-t-[#9E2102] border-l-[#9E2102] animate-spin-slow-reverse" />
          <div className="animate-float">
            <Image
              src="/favicon.ico"
              alt="EduChainX"
              width={64}
              height={64}
              className="w-16 h-16"
              priority
            />
          </div>
        </div>

        <div className="text-2xl font-black tracking-normal">
          <span className="text-white">Edu</span>
          <span style={{ color: "#E85E1D" }}>Chain</span>
          <span style={{ color: "#9E2102" }}>X</span>
        </div>

        <p className="text-sm text-[#737373] h-5 whitespace-nowrap">
          {STATUS_MESSAGES[statusIndex]}
        </p>

        <div className="flex flex-col items-center gap-1.5">
          <div className="w-48 sm:w-[200px] h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(to right, #9E2102, #E85E1D)",
                boxShadow: progress > 0 ? "0 0 8px rgba(232,94,29,0.3)" : "none",
              }}
            />
          </div>
          <span className="text-xs text-[#737373] tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function Corner({ position }: { position: string }) {
  const base = "absolute w-6 h-6 sm:w-8 sm:h-8";
  const color = "#E85E1D";

  const placement: Record<string, string> = {
    "top-left": "top-4 left-4 sm:top-6 sm:left-6",
    "top-right": "top-4 right-4 sm:top-6 sm:right-6",
    "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
    "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
  };

  const borders: Record<string, React.CSSProperties> = {
    "top-left": { borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
    "top-right": { borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` },
    "bottom-left": { borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
    "bottom-right": { borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` },
  };

  return <div className={`${base} ${placement[position]}`} style={borders[position]} />;
}

function NodeDot({ position }: { position: string }) {
  const placement: Record<string, string> = {
    "top-left": "top-3.5 left-3.5 sm:top-5 sm:left-5",
    "top-right": "top-3.5 right-3.5 sm:top-5 sm:right-5",
    "bottom-left": "bottom-3.5 left-3.5 sm:bottom-5 sm:left-5",
    "bottom-right": "bottom-3.5 right-3.5 sm:bottom-5 sm:right-5",
  };

  return (
    <div className={`absolute ${placement[position]} w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-node-blink`} />
  );
}
