"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Coins,
  Building2,
  BadgeCheck,
  GraduationCap,
  Users,
  FileStack,
} from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import React from "react";

const stats = [
  { value: "12.4k", label: "SOL VOLUME", icon: Coins },
  { value: "12", label: "UNIVERSITIES", icon: Building2 },
  { value: "89,330", label: "CERTIFICATES VERIFIED", icon: BadgeCheck },
  { value: "1,204", label: "INSTRUCTORS", icon: GraduationCap },
  { value: "45,000+", label: "ACTIVE STUDENTS", icon: Users },
  { value: "128,402", label: "NFTS ISSUED", icon: FileStack },
];

function AnimatedCounter({
  value,
  className,
}: {
  value: string;
  className: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const numericPart = value.replace(/[^0-9.]/g, "");
  const suffix = value.replace(/[0-9.,]/g, "");
  const hasComma = value.includes(",");
  const target = parseFloat(numericPart.replace(/,/g, ""));
  const hasDecimal = numericPart.includes(".");

  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v: number) => {
    if (hasDecimal) {
      const formatted = v.toFixed(1);
      return hasComma ? Number(formatted).toLocaleString() : formatted;
    }
    const formatted = Math.round(v);
    return hasComma ? formatted.toLocaleString() : String(formatted);
  });

  React.useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, target, {
      duration: 2,
      ease: [0.25, 0.1, 0.25, 1],
    });
    return controls.stop;
  }, [isInView, motionVal, target]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

/** Animated statistics banner displaying platform metrics with scroll-triggered counters. */
export function StatsBanner() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  useEffect(() => setMounted(true), []);
  const isLight = mounted && theme === "light";

  return (
    <section
      className={cn(
        "relative py-12 lg:py-20 transition-colors overflow-hidden",
        isLight ? "bg-[#FDF6EE]" : "bg-[#111111]"
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-px",
          isLight
            ? "bg-gradient-to-r from-transparent via-[#E85E1D]/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-[#E85E1D]/20 to-transparent"
        )}
      />

      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none",
          isLight ? "bg-[#9E2102]/[0.03]" : "bg-[#E85E1D]/[0.04]"
        )}
      />

      <div className="text-center mb-8 lg:mb-12 relative">
        <div className="overflow-hidden">
          <motion.p
            className="text-[10px] lg:text-[11px] font-semibold tracking-[2px] text-[#E85E1D] uppercase mb-2"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            BY THE NUMBERS
          </motion.p>
        </div>
        <div className="overflow-hidden">
          <motion.h3
            className={cn(
              "text-[18px] lg:text-[24px] font-[900]",
              isLight ? "text-[#1a0a00]" : "text-white"
            )}
            style={{ letterSpacing: "-0.5px" }}
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Growing every day
          </motion.h3>
        </div>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 max-w-6xl mx-auto px-5 lg:px-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="relative flex flex-col items-center text-center py-6 lg:py-8 px-3 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {idx < stats.length - 1 && (
                <div
                  className={cn(
                    "absolute right-0 top-1/4 bottom-1/4 w-px hidden lg:block",
                    isLight
                      ? "bg-gradient-to-b from-transparent via-[#9E2102]/10 to-transparent"
                      : "bg-gradient-to-b from-transparent via-white/[0.06] to-transparent"
                  )}
                />
              )}
              <motion.div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center mb-3",
                  isLight ? "bg-[#E85E1D]/[0.08]" : "bg-[#E85E1D]/10"
                )}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1 + 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{ scale: 1.15 }}
              >
                <Icon size={16} strokeWidth={2} className="text-[#E85E1D]" />
              </motion.div>
              <AnimatedCounter
                value={stat.value}
                className="text-[26px] lg:text-[32px] font-[900] leading-none mb-1.5 italic transition-colors duration-300 text-[#E85E1D] group-hover:text-[#9E2102]"
              />
              <span
                className={cn(
                  "text-[9px] lg:text-[10px] font-semibold tracking-[1.5px] uppercase leading-tight",
                  isLight ? "text-[#6b4c35]" : "text-white/50"
                )}
              >
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px",
          isLight
            ? "bg-gradient-to-r from-transparent via-[#E85E1D]/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-[#E85E1D]/20 to-transparent"
        )}
      />
    </section>
  );
}
