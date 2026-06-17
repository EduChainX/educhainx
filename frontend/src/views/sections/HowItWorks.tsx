"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ShieldCheck, Radio, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Verify your matric number",
    description: "Prove you are a real, enrolled student.",
    detail:
      "Your student ID is checked against the institutional registry in real time. Only verified, currently enrolled students pass through.",
  },
  {
    number: "02",
    icon: Radio,
    title: "Mint your decentralized identity",
    description: "A permanent DID, cryptographically yours.",
    detail:
      "Once verified, a decentralized identifier is generated on-chain — a tamper-proof digital identity you own forever.",
  },
  {
    number: "03",
    icon: Award,
    title: "Earn on-chain certificates",
    description: "Course completions become verifiable NFTs.",
    detail:
      "Every course you complete mints a verifiable credential as an NFT. Employers and institutions can confirm it instantly.",
  },
];

export function HowItWorks() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  useEffect(() => setMounted(true), []);
  const isLight = mounted && theme === "light";

  return (
    <section
      id="how-it-works"
      className={cn(
        "relative scroll-mt-20 px-5 lg:px-20 py-14 lg:py-28 transition-colors",
        isLight ? "bg-[#1a0a00] text-white" : "bg-[#0d0d0d]"
      )}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(232,94,29,0.04) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative text-center mb-12 lg:mb-20 max-w-3xl mx-auto">
        <div className="overflow-hidden">
          <motion.p
            className="text-[10px] lg:text-[11px] font-semibold tracking-[2px] text-[#E85E1D] uppercase mb-3"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            THE PROCESS
          </motion.p>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            className="text-[24px] lg:text-[40px] font-[900] leading-[1.1] mb-4 text-white"
            style={{ letterSpacing: "-1px" }}
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            How It Works
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.p
            className="text-[13px] lg:text-[15px] max-w-lg mx-auto text-white/40"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Three steps from enrolled student to globally verifiable credentials.
          </motion.p>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="hidden lg:block absolute top-[72px] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-[2px] bg-gradient-to-r from-[#E85E1D]/20 via-[#E85E1D]/40 to-[#E85E1D]/20" />
        <div className="lg:hidden absolute top-0 bottom-0 left-[29px] w-[2px] bg-gradient-to-b from-[#E85E1D]/20 via-[#E85E1D]/40 to-[#E85E1D]/20" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <motion.div
                key={step.number}
                className={cn(
                  "relative flex lg:flex-col",
                  !isLast && "pb-10 lg:pb-0"
                )}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <motion.div
                  className="relative z-10 flex-shrink-0 mr-5 lg:mr-0 lg:mx-auto lg:mb-8"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.2 + 0.3,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center border-2 bg-[#111111] border-[#E85E1D]/30">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#E85E1D]/15">
                      <Icon size={22} className="text-[#E85E1D]" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="relative flex-1 rounded-xl border p-5 lg:p-6 group lg:text-center bg-[#111111]/80 border-white/[0.06] hover:border-[#E85E1D]/25 hover:shadow-[0_8px_30px_rgba(232,94,29,0.06)]"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span className="absolute top-3 right-4 lg:top-4 lg:right-5 text-[48px] lg:text-[56px] font-[900] leading-none select-none pointer-events-none text-white/[0.03]">
                    {step.number}
                  </span>
                  <h3 className="text-[15px] lg:text-[17px] font-bold mb-2 relative z-10 text-white">
                    {step.title}
                  </h3>
                  <p className="text-[11px] lg:text-[12px] font-semibold mb-3 relative z-10 text-[#E85E1D]">
                    {step.description}
                  </p>
                  <p className="text-[11px] lg:text-[12px] leading-[1.7] relative z-10 text-white/35">
                    {step.detail}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E85E1D]">
                    Learn more <ArrowRight size={12} />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
