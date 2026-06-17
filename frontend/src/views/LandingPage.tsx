"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { WhySection } from "@/views/sections/WhySection";
import { HowItWorks } from "@/views/sections/HowItWorks";
import { StatsBanner } from "@/views/sections/StatsBanner";
import { VerifyShowcase } from "@/views/sections/VerifyShowcase";
import { NavBar } from "@/components/educhain/nav-bar";
import Image from "next/image";

const slides = [
  {
    counter: "/ 01",
    label: "ON-CHAIN CREDENTIALS",
    subtitle: "Verified · Permanent · Yours",
    headingTop: "Own Your",
    headingAccent: "Learning.",
    imgUrl: "/bg1.png",
    imgStyle: "-rotate-30 ",
    description:
      "EduChain puts Nigerian university credentials on-chain with real student-ID verification. Tokenized courses, instant transcript access, and certificates that are immutable and traceable.",
  },
  {
    counter: "/ 02",
    label: "VERIFIED TRANSCRIPTS",
    subtitle: "Instant · Trusted · Global",
    headingTop: "Verify Your",
    headingAccent: "Future.",
    imgUrl: "/bg2.png",
    imgStyle: "-rotate-30",
    description:
      "Access your academic records anytime, anywhere. Employers and institutions can verify your credentials instantly through our decentralized verification network.",
  },
  {
    counter: "/ 03",
    label: "ACADEMIC IDENTITY",
    subtitle: "Secure · Portable · Forever",
    headingTop: "Build Your",
    headingAccent: "Legacy.",
    imgUrl: "/bg3.png",
    imgStyle: " -rotate-30",
    description:
      "Your academic achievements live forever on the blockchain. No forgeries, no lost records — a permanent digital identity that grows with your career.",
  },
];

function ThemeToggleSwitch({
  isLight,
  onToggle,
}: {
  isLight: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-[36px] h-[36px] rounded-full border flex items-center px-[3px] transition-colors",
        isLight
          ? "bg-light-surface border-brand-primary/15"
          : "bg-[#1a1a1a] border-white/[0.08]"
      )}
    >
      <span
        className={cn(
          "absolute flex items-center justify-center",
          isLight
            ? "left-[4px] text-brand-primary"
            : "right-[3px] text-brand-accent"
        )}
      >
        {isLight ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
      </span>
    </button>
  );
}

export const LandingPage = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const isLight = mounted && theme === "light";

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <main
      className={cn(
        "font-sans transition-colors duration-300",
        isLight ? "bg-light-bg text-light-text" : "bg-dark text-white"
      )}
    >
      <NavBar />

      {/* MOBILE TOP BAR */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3.5 border-b lg:hidden",
          isLight
            ? "bg-light-bg border-brand-primary/10"
            : "bg-dark border-white/[0.08]"
        )}
      >
        <span className="flex items-center gap-2 text-[20px] font-bold tracking-wide">
          <Image src="/favicon.ico" alt="EduChainX" width={24} height={24} className="rounded-sm" />
          Edu<span className="text-brand-accent">ChainX</span>
        </span>
        <ThemeToggleSwitch isLight={isLight} onToggle={toggleTheme} />
      </div>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative flex lg:h-screen overflow-hidden">
        {/* Mobile-only: animated background image — slide in, fixed height */}

        {/* LEFT SIDEBAR — desktop only */}
        <aside
          className={cn(
            "relative hidden lg:flex flex-col items-center overflow-hidden justify-around w-[100px] border-r px-6 transition-colors duration-300",
            isLight
              ? "bg-[#1a0a00] border-white/[0.08]"
              : "bg-dark border-white/[0.08]"
          )}
        >
          <div className="flex flex-col items-center gap-3 mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "text-[11px] font-semibold transition-colors",
                  i === current
                    ? "text-brand-accent"
                    : "text-white/25"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
            <div className="absolute rotate-90 text-9xl font-bold bottom-20 text-brand-accent/[0.06]">
              EDX
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mb-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-[3px] h-10 rounded-full transition-colors",
                  i === current
                    ? "bg-brand-accent"
                    : "bg-white/15"
                )}
              />
            ))}
          </div>
        </aside>

        {/* MAIN COLUMN */}
        <div className="flex flex-col flex-1 relative z-10 pt-[56px] lg:pt-3 lg:p-3 lg:pr-0 overflow-hidden">
          {/* Desktop logo + theme toggle */}
          <div className="hidden lg:flex items-center justify-between py-3 pr-6">
            <span className="flex items-center gap-3 text-4xl font-bold tracking-wide">
              <Image src="/favicon.ico" alt="EduChainX" width={36} height={36} className="rounded-sm" />
              Edu<span className="text-brand-accent">ChainX</span>
            </span>
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isLight
                  ? "text-brand-primary hover:bg-brand-primary/10"
                  : "text-brand-accent hover:bg-white/10"
              )}
            >
              {isLight ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* ============ MOBILE HERO ============ */}
          <div className="flex flex-col px-5 pt-6 lg:hidden relative z-20 overflow-hidden">
            <div className="absolute  inset-0 lg:hidden overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`mobile-bg-${current}`}
                  className="absolute inset-0 bg- bg-center"
                  style={{ backgroundImage: `url(${slides[current].imgUrl})` }}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />
              </AnimatePresence>
              {/* Gradient overlay for text readability */}
              <div
                className={cn(
                  "absolute inset-0 z-[1]",
                  `${!isLight && "bg-gradient-to-b from-transparent via-dark/60 to-dark"}`
                )}
              />
            </div>
            <section className="relative z-20">
              <p className="text-[12px] font-semibold tracking-[1.5px] text-brand-accent uppercase mb-1">
                {slide.label}
              </p>
              <p
                className={cn(
                  "text-[13px] mb-4",
                  isLight ? "text-light-text/60" : "text-white/55"
                )}
              >
                {slide.subtitle}
              </p>

              <div className="overflow-hidden">
                <motion.h1
                  className="text-[36px] font-[900] leading-[1.05] mb-5"
                  style={{ letterSpacing: "-1px" }}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  key={`mobile-heading-${current}`}
                >
                  {slide.headingTop}
                  <br />
                  <span className="text-brand-accent">{slide.headingAccent}</span>
                </motion.h1>
              </div>

              <p
                className={cn(
                  "text-[14px] leading-[1.8] mb-5 p-4",
                  isLight ? "text-light-text bg-light-bg/70 backdrop-blur-[]" : "text-white/65"
                )}
              >
                {slide.description}
              </p>

              <div className="flex flex-col gap-2.5 mb-5">
                <button
                  onClick={() => router.push("/onboarding")}
                  className="flex items-center justify-center gap-2 bg-brand-primary text-white text-[14px] font-semibold py-3.5 rounded-lg hover:brightness-110 transition"
                >
                  Start Onboarding
                  <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => router.push("/marketplace")}
                  className={cn(
                    "flex items-center justify-center text-[14px] font-medium py-3.5 rounded-lg border transition",
                    isLight
                      ? "border-brand-primary/15 text-white bg-brand-primary"
                      : "border-white/15 text-white/60 hover:bg-white"
                  )}
                >
                  Explore Courses
                </button>
              </div>

              <div className="flex gap-2 justify-center mb-5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "h-[6px] rounded-full transition-all",
                      i === current
                        ? "w-5 bg-brand-accent"
                        : cn(
                          "w-[6px]",
                          isLight ? "bg-brand-primary/20" : "bg-white/25"
                        )
                    )}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* ============ DESKTOP HERO ============ */}
          <div className="hidden lg:flex flex-1 w-full flex-row items-center relative z-10">
            <motion.div
              className="absolute top-[-10%] right-1/2 translate-x-1/2 z-0"
              style={{ y: heroImageY }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`desktop-img-${current}`}
                  initial={{ opacity: 0, x: 40, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.97 }}
                  transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Image
                    alt=""
                    width={800}
                    height={800}
                    src={slide.imgUrl}
                    className={slide.imgStyle}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="w-full flex flex-row items-center justify-around h-full"
              style={{ y: heroTextY, opacity: heroOpacity }}
            >
              <section
                className={cn(
                  "flex gap-2 flex-col relative z-10 rounded-2xl px-5 py-4",
                  isLight && "bg-light-bg/70 backdrop-blur-sm"
                )}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span
                    className={cn(
                      "text-[14px] font-medium",
                      isLight ? "text-light-text/70" : "text-white/55"
                    )}
                  >
                    {slide.counter}
                  </span>
                </div>
                <p className="text-[13px] font-semibold tracking-[0.15em] text-brand-accent uppercase mb-2">
                  {slide.label}
                </p>
                <p
                  className={cn(
                    "text-[14px] mb-3",
                    isLight ? "text-light-text/70" : "text-white/55"
                  )}
                >
                  {slide.subtitle}
                </p>
              </section>

              <section
                className={cn(
                  "flex gap-3 flex-col relative z-10 self-end rounded-2xl px-5 py-4",
                  isLight && "bg-light-bg/70 backdrop-blur-sm"
                )}
              >
                <div className="overflow-hidden">
                  <motion.h1
                    className={cn(
                      "font-[900] leading-[1.05] mb-5",
                      isLight && "text-light-text"
                    )}
                    style={{
                      fontSize: "clamp(36px, 5vw, 58px)",
                      letterSpacing: "-2px",
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    key={`desktop-heading-${current}`}
                  >
                    {slide.headingTop}
                    <br />
                    <span className="text-brand-accent">
                      {slide.headingAccent}
                    </span>
                  </motion.h1>
                </div>
                <p
                  className={cn(
                    "text-[15px] leading-[1.7] max-w-[420px] mb-7",
                    isLight ? "text-light-text/80" : "text-white/60"
                  )}
                >
                  {slide.description}
                </p>
              </section>
            </motion.div>
          </div>

          {/* DESKTOP CTA BUTTONS */}
          <motion.div
            className="hidden lg:flex flex-wrap items-center gap-3 mb-5 w-full relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button
              onClick={() => router.push("/onboarding")}
              className={cn(
                "inline-flex items-center gap-2 text-[14px] font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition",
                isLight
                  ? "bg-brand-primary text-white"
                  : "bg-brand-accent/50 text-white"
              )}
            >
              Start Onboarding
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => router.push("/marketplace")}
              className={cn(
                "inline-flex items-center gap-2 text-[14px] font-semibold px-6 py-3 rounded-lg transition",
                isLight
                  ? "border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5"
                  : "border border-white/20 text-white hover:bg-white/5"
              )}
            >
              Explore Courses
            </button>
          </motion.div>

          {/* BOTTOM INFO PANEL */}
          <div
            className={cn(
              "w-full lg:w-fit lg:self-end relative z-10 grid grid-cols-1 sm:grid-cols-2 border-t transition-colors duration-300",
              isLight
                ? "bg-[#1a0a00] border-white/[0.08] text-white"
                : "bg-dark-panel border-white/[0.08]"
            )}
          >
            <div className="px-4 sm:px-6 lg:px-7 py-3.5 lg:py-5 border-b sm:border-b-0 sm:border-r border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1.5 lg:mb-2">
                <span className="text-[10px] lg:text-[11px] font-semibold tracking-[1.5px] uppercase text-white/35">
                  Upcoming
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-brand-accent/15 text-brand-accent">
                  Soon
                </span>
              </div>
              <p className="text-[13px] lg:text-[15px] font-semibold mb-0.5 lg:mb-1">
                Verification Summit
              </p>
              <p className="text-[11px] lg:text-[13px] text-white/55">
                Lagos — August 2026
              </p>
            </div>

            <div className="px-4 sm:px-6 lg:px-7 py-3.5 lg:py-5">
              <span className="text-[10px] lg:text-[11px] font-semibold tracking-[1.5px] uppercase block mb-1.5 lg:mb-2 text-white/35">
                News
              </span>
              <p className="text-[13px] lg:text-[15px] font-semibold mb-0.5 lg:mb-1">
                Partnership with 5 new universities
              </p>
              <p className="text-[11px] lg:text-[13px] mb-1.5 lg:mb-2 text-white/55">
                Expanding our network across West Africa
              </p>
              <a
                href="#"
                className="text-[12px] lg:text-[13px] font-semibold text-brand-accent hover:underline"
              >
                Read More
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR — desktop only */}
        <aside
          className={cn(
            "hidden lg:flex flex-col items-center justify-center w-[100px] border-l shrink-0 gap-6 transition-colors duration-300 relative z-10",
            isLight
              ? "bg-[#1a0a00] border-white/[0.08]"
              : "bg-dark border-white/[0.08]"
          )}
        >
          {[
            "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
            "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
            "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
            "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
          ].map((d, i) => (
            <a
              key={i}
              href="#"
              className="transition-colors text-white/25 hover:text-white/60"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d={d} />
              </svg>
            </a>
          ))}
        </aside>

      </section>

      {/* HORIZON DIVIDER */}
      <div
        className={cn(
          "w-full h-[60px] lg:h-[80px]",
          isLight ? "bg-light-bg" : "bg-dark"
        )}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="horizon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9E2102" stopOpacity="0" />
              <stop offset="20%" stopColor="#9E2102" stopOpacity={isLight ? "0.15" : "0.25"} />
              <stop offset="50%" stopColor="#E85E1D" stopOpacity={isLight ? "0.3" : "0.45"} />
              <stop offset="80%" stopColor="#9E2102" stopOpacity={isLight ? "0.15" : "0.25"} />
              <stop offset="100%" stopColor="#9E2102" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,50 C360,10 1080,10 1440,50"
            fill="none"
            stroke="url(#horizon-grad)"
            strokeWidth="2"
          />
          <path
            d="M0,55 C380,18 1060,18 1440,55"
            fill="none"
            stroke="url(#horizon-grad)"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </svg>
      </div>

      <WhySection />
      <HowItWorks />
      <StatsBanner />
      <VerifyShowcase />
    </main>
  );
};
