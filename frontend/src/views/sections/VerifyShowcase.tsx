"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const bulletPoints = [
  "Checked against the source university registry, not a copy.",
  "Tamper-proof — records cannot be altered once anchored.",
  "Instant result, with the on-chain proof one click away.",
];

/** Credential verification showcase with interactive 3D card and CTA to the verification registry. */
export function VerifyShowcase() {
  const router = useRouter();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden transition-colors duration-300 bg-background text-foreground">
      <div className="relative max-w-6xl mx-auto px-5 lg:px-10">
        <motion.p
          className="text-center text-[10px] lg:text-[12px] font-bold tracking-[4px] lg:tracking-[6px] uppercase mb-6 lg:mb-10 text-accent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          EDUCHAINX
        </motion.p>

        <div className="relative flex items-center justify-center mb-4 lg:mb-6">
          <motion.div
            className="text-center select-none pointer-events-none font-[900] leading-[0.85] tracking-[-4px] lg:tracking-[-8px] text-foreground/[0.06]"
            style={{ fontSize: "clamp(80px, 18vw, 220px)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            VERIFY
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ perspective: 800 }}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <motion.div
              className="w-[300px] sm:w-[360px] lg:w-[420px] rounded-2xl border border-border p-7 lg:p-9 backdrop-blur-sm shadow-2xl cursor-pointer bg-card/90"
              whileHover={{
                rotateY: 8,
                rotateX: -4,
                scale: 1.04,
                boxShadow: "0 25px 60px rgba(232,94,29,0.12)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-green-500" />
                </div>
                <span className="text-[10px] lg:text-[11px] font-bold tracking-[1.5px] uppercase text-green-500">
                  Credential Verified
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-13 h-13 rounded-full flex items-center justify-center bg-accent/15">
                  <User size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-[15px] lg:text-[17px] font-bold leading-tight">
                    Excel Chimnonso
                  </p>
                  <p className="text-[11px] lg:text-[12px] text-muted-foreground">
                    B.Eng Software Engineering
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-6">
                {[
                  { label: "INSTITUTION", value: "FUTO" },
                  { label: "YEAR", value: "2026" },
                  { label: "BLOCKCHAIN ID", value: "0x7f...3a1c" },
                  { label: "NFT", value: "#781F21a" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[8px] lg:text-[9px] font-semibold tracking-[1px] uppercase mb-1 text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-[12px] lg:text-[14px] font-semibold">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border text-center">
                <p className="text-[9px] lg:text-[10px] text-muted-foreground">
                  Anchored on-chain for global verification
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="text-center mb-10 lg:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2
            className="font-[900] leading-[0.9] tracking-[-2px] lg:tracking-[-4px] text-transparent"
            style={{
              fontSize: "clamp(40px, 10vw, 120px)",
              WebkitTextStroke: "2px color-mix(in srgb, var(--foreground) 12%, transparent)",
            }}
          >
            A CREDENTIAL
          </h2>
        </motion.div>

        <motion.div
          className="w-full h-px mb-8 lg:mb-10 bg-gradient-to-r from-transparent via-border to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.div
          className="flex justify-center mb-12 lg:mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="px-5 py-2 border border-border text-[12px] lg:text-[14px] font-bold tracking-[3px] text-foreground">
            2026
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row items-start gap-8 lg:gap-14 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] rounded-xl border border-border flex items-center justify-center bg-secondary">
              <Image
                src="/favicon.ico"
                alt="EduChainX"
                width={44}
                height={44}
                className="rounded-sm"
              />
            </div>
            <span className="text-[8px] font-bold tracking-[2px] uppercase text-muted-foreground">
              EDUCHAINX
            </span>
          </div>

          <div className="flex-1">
            <p className="text-[10px] lg:text-[11px] font-semibold tracking-[2px] text-accent uppercase mb-3">
              FOR EMPLOYERS & INSTITUTIONS
            </p>
            <h3
              className="text-[20px] lg:text-[26px] font-[900] mb-4"
              style={{ letterSpacing: "-0.5px" }}
            >
              Verify a Credential
            </h3>
            <p className="text-[12px] lg:text-[13px] leading-[1.8] mb-6 max-w-xl text-muted-foreground">
              Confirm any EduChain certificate directly against the institutional
              registry and the Solana chain — no account, no penalties, no waiting
              and no third-party office. Paste a DID or certificate ID and get a
              definitive answer in seconds.
            </p>
            <ul className="flex flex-col gap-3 mb-7">
              {bulletPoints.map((point, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                >
                  <Shield
                    size={14}
                    className="text-accent mt-0.5 shrink-0"
                  />
                  <span className="text-[11px] lg:text-[12px] leading-[1.6] text-muted-foreground">
                    {point}
                  </span>
                </motion.li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/verification")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-[12px] lg:text-[13px] font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition"
            >
              Open Verification Registry <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
