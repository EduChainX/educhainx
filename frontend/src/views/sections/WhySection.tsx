"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Hexagon,
  CircleDollarSign,
  ShieldCheck,
  CheckCircle2,
  Link2,
  Wallet,
  Coins,
} from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    number: "01.",
    title: "The verified-student gate",
    description:
      "Anyone can build an NFT course marketplace. Ours only lets real, enrolled students in — every account is checked against the institutional registry before a single credential is issued. That gate is the moat: and it's why the credentials actually mean something to an employer.",
    icon: ShieldCheck,
  },
  {
    number: "02.",
    title: "NFT Certificates",
    description:
      "Course completions minted as verifiable NFTs/SFTs straight to your identity — confirmable by anyone, instantly.",
    icon: Hexagon,
  },
  {
    number: "03.",
    title: "Instant Tutor Payments",
    description:
      "Trustless SOL payment rails release funds the moment a milestone is met. No middlemen, no waiting.",
    icon: CircleDollarSign,
  },
];

function VerificationCard({ isLight }: { isLight: boolean }) {
  const checks = ["Registry match", "Enrollment confirmed", "Identity anchored"];
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-[9px] lg:text-[10px] font-bold tracking-[1.5px] uppercase text-green-500">
          Verification Active
        </span>
      </div>
      <div
        className={cn(
          "rounded-lg px-3 py-2.5 mb-4 border",
          isLight
            ? "bg-[#FDF6EE]/50 border-[#9E2102]/[0.06]"
            : "bg-white/[0.03] border-white/[0.06]"
        )}
      >
        <p
          className={cn(
            "text-[8px] lg:text-[9px] font-semibold tracking-[1px] uppercase mb-1",
            isLight ? "text-[#6b4c35]/50" : "text-white/25"
          )}
        >
          MATRIC NUMBER
        </p>
        <p
          className={cn(
            "text-[14px] lg:text-[16px] font-bold font-mono",
            isLight ? "text-[#1a0a00]" : "text-white"
          )}
        >
          FUTO/2022/0847
          <span className="inline-block w-[2px] h-[14px] bg-[#E85E1D] ml-0.5 animate-pulse align-middle" />
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {checks.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-green-500 shrink-0" />
            <span
              className={cn(
                "text-[11px] lg:text-[12px]",
                isLight ? "text-[#6b4c35]" : "text-white/50"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 bg-green-500/10 rounded-md px-2.5 py-1.5 w-fit">
        <ShieldCheck size={12} className="text-green-500" />
        <span className="text-[9px] lg:text-[10px] font-bold tracking-[1px] uppercase text-green-500">
          Access Granted
        </span>
      </div>
    </>
  );
}

function NFTCertificateCard({ isLight }: { isLight: boolean }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Hexagon size={14} className="text-[#E85E1D]" />
        <span className="text-[9px] lg:text-[10px] font-bold tracking-[1.5px] uppercase bg-[#E85E1D]/15 text-[#E85E1D] px-2 py-0.5 rounded">
          Minted
        </span>
      </div>
      <div className="mb-4">
        <p
          className={cn(
            "text-[14px] lg:text-[16px] font-bold leading-tight mb-1",
            isLight ? "text-[#1a0a00]" : "text-white"
          )}
        >
          Introduction to Blockchain
        </p>
        <p
          className={cn(
            "text-[11px] lg:text-[12px]",
            isLight ? "text-[#6b4c35]" : "text-white/45"
          )}
        >
          Federal University of Technology, Owerri
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p
            className={cn(
              "text-[8px] lg:text-[9px] font-semibold tracking-[1px] uppercase mb-1",
              isLight ? "text-[#6b4c35]/50" : "text-white/25"
            )}
          >
            Token ID
          </p>
          <p
            className={cn(
              "text-[12px] lg:text-[14px] font-semibold font-mono",
              isLight ? "text-[#1a0a00]" : "text-white"
            )}
          >
            #4A2F
          </p>
        </div>
        <div>
          <p
            className={cn(
              "text-[8px] lg:text-[9px] font-semibold tracking-[1px] uppercase mb-1",
              isLight ? "text-[#6b4c35]/50" : "text-white/25"
            )}
          >
            Chain
          </p>
          <p
            className={cn(
              "text-[12px] lg:text-[14px] font-semibold",
              isLight ? "text-[#1a0a00]" : "text-white"
            )}
          >
            Solana
          </p>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center justify-between pt-3 border-t",
          isLight ? "border-[#9E2102]/[0.06]" : "border-white/[0.06]"
        )}
      >
        <div className="flex items-center gap-1.5">
          <Link2
            size={11}
            className={cn(isLight ? "text-[#6b4c35]/40" : "text-white/25")}
          />
          <span
            className={cn(
              "text-[10px] lg:text-[11px] font-mono",
              isLight ? "text-[#6b4c35]/50" : "text-white/30"
            )}
          >
            7xK9...mQ3z
          </span>
        </div>
        <span className="text-[9px] lg:text-[10px] text-[#E85E1D] font-semibold">
          Verified on-chain
        </span>
      </div>
    </>
  );
}

function PaymentCard({ isLight }: { isLight: boolean }) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-500" />
          <span className="text-[9px] lg:text-[10px] font-bold tracking-[1.5px] uppercase text-green-500">
            Payment Complete
          </span>
        </div>
        <Coins size={16} className="text-[#E85E1D]" />
      </div>
      <div className="mb-4">
        <p
          className={cn(
            "text-[28px] lg:text-[32px] font-[900] leading-none mb-1",
            isLight ? "text-[#1a0a00]" : "text-white"
          )}
        >
          2.4 <span className="text-[#E85E1D] text-[18px] lg:text-[20px]">SOL</span>
        </p>
        <p
          className={cn(
            "text-[11px] lg:text-[12px]",
            isLight ? "text-[#6b4c35]/60" : "text-white/35"
          )}
        >
          ≈ $340.00 USD
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p
            className={cn(
              "text-[8px] lg:text-[9px] font-semibold tracking-[1px] uppercase mb-1",
              isLight ? "text-[#6b4c35]/50" : "text-white/25"
            )}
          >
            Milestone
          </p>
          <p
            className={cn(
              "text-[11px] lg:text-[12px] font-semibold",
              isLight ? "text-[#1a0a00]" : "text-white"
            )}
          >
            Module 3 Complete
          </p>
        </div>
        <div>
          <p
            className={cn(
              "text-[8px] lg:text-[9px] font-semibold tracking-[1px] uppercase mb-1",
              isLight ? "text-[#6b4c35]/50" : "text-white/25"
            )}
          >
            Recipient
          </p>
          <p
            className={cn(
              "text-[11px] lg:text-[12px] font-semibold",
              isLight ? "text-[#1a0a00]" : "text-white"
            )}
          >
            Dr. Adeyemi
          </p>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center justify-between pt-3 border-t",
          isLight ? "border-[#9E2102]/[0.06]" : "border-white/[0.06]"
        )}
      >
        <div className="flex items-center gap-1.5">
          <Wallet
            size={11}
            className={cn(isLight ? "text-[#6b4c35]/40" : "text-white/25")}
          />
          <span
            className={cn(
              "text-[10px] lg:text-[11px] font-mono",
              isLight ? "text-[#6b4c35]/50" : "text-white/30"
            )}
          >
            8fG2...vR1x
          </span>
        </div>
        <span
          className={cn(
            "text-[9px] lg:text-[10px]",
            isLight ? "text-[#6b4c35]/40" : "text-white/25"
          )}
        >
          Settled instantly
        </span>
      </div>
    </>
  );
}

const visualCards = [VerificationCard, NFTCertificateCard, PaymentCard];

/** "Why EduChain" section showcasing the verified-student gate, NFT certificates, and instant payments. */
export function WhySection() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  useEffect(() => setMounted(true), []);
  const isLight = mounted && theme === "light";

  return (
    <section
      className={cn(
        "relative px-5 lg:px-20 py-14 lg:py-24 transition-colors overflow-hidden",
        isLight ? "bg-[#FDF6EE]" : "bg-[#111111]"
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] lg:text-[28rem] font-[900] leading-none select-none pointer-events-none",
          isLight ? "text-[#9E2102]/[0.03]" : "text-white/[0.02]"
        )}
      >
        EDX
      </div>

      <div className="mb-10 lg:mb-16 max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <motion.p
            className="text-[10px] lg:text-[11px] font-semibold tracking-[2px] text-[#E85E1D] uppercase mb-3"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            WHY EDUCHAIN
          </motion.p>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            className={cn(
              "text-[24px] lg:text-[38px] font-[900] leading-[1.1]",
              isLight ? "text-[#1a0a00]" : "text-white"
            )}
            style={{ letterSpacing: "-1px" }}
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Built around one hard guarantee.
          </motion.h2>
        </div>
      </div>

      <div className="flex flex-col gap-16 lg:gap-24 max-w-6xl mx-auto">
        {cards.map((card, idx) => {
          const isEven = idx % 2 === 1;
          const VisualCard = visualCards[idx];
          return (
            <motion.div
              key={idx}
              className={cn(
                "flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center",
                isEven && "lg:flex-row-reverse"
              )}
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: idx * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3 lg:mb-4">
                  <span
                    className={cn(
                      "text-[28px] lg:text-[36px] font-[900]",
                      isLight ? "text-[#3c1400]/10" : "text-white/[0.06]"
                    )}
                  >
                    {card.number}
                  </span>
                  <div
                    className={cn(
                      "flex-1 h-[1px] max-w-[80px]",
                      isLight ? "bg-[#E85E1D]/40" : "bg-[#E85E1D]/30"
                    )}
                  />
                </div>
                <h3
                  className={cn(
                    "text-[20px] lg:text-[26px] font-bold mb-4 lg:mb-5 italic",
                    isLight ? "text-[#1a0a00]" : "text-white"
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={cn(
                    "text-[13px] lg:text-[14px] leading-[1.8] max-w-[480px]",
                    isLight ? "text-[#6b4c35]" : "text-white/45"
                  )}
                >
                  {card.description}
                </p>
              </div>

              <div className="flex-1 w-full lg:w-auto flex justify-center">
                <motion.div
                  className={cn(
                    "relative w-full lg:w-[340px] rounded-xl border overflow-hidden p-5 lg:p-6",
                    isLight
                      ? "bg-[#FAF2E8] border-[#9E2102]/[0.08]"
                      : "bg-[#0d0d0d] border-white/[0.08]"
                  )}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div
                    className={cn(
                      "absolute inset-0 pointer-events-none",
                      isLight
                        ? "bg-[radial-gradient(ellipse_at_50%_110%,_rgba(158,33,2,0.08)_0%,_transparent_70%)]"
                        : "bg-[radial-gradient(ellipse_at_50%_110%,_rgba(158,33,2,0.25)_0%,_transparent_70%)]"
                    )}
                  />
                  <div className="relative z-10">
                    <VisualCard isLight={isLight} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
