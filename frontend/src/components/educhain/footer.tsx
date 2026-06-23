"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useSidebar } from "./sidebar-context";

const communityLinks = [
  { label: "Twitter / X", href: "https://x.com" },
  { label: "Telegram channel", href: "https://t.me" },
  { label: "Discord server", href: "https://discord.gg" },
  { label: "Youtube channel", href: "https://youtube.com" },
];

const exploreLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Verification", href: "/verification" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Certificates", href: "/certificates" },
];

const socialIcons = [
  {
    label: "Twitter",
    path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
  },
  {
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Telegram",
    path: "M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
];

/** Site-wide footer with community links, explore links, email subscription, and social icons. */
export function SiteFooter() {
  const [email, setEmail] = React.useState("");
  const { hasSidebar, collapsed } = useSidebar();

  return (
    <footer
      className={cn(
        "relative overflow-hidden transition-[margin] duration-300 bg-card text-card-foreground border-t border-border",
        // When a sidebar is present: minimized rail tucks beside the footer
        // (reserve its 76px width); expanded rail (z-40) overlays the footer instead.
        hasSidebar && (collapsed ? "lg:ml-[76px]" : "lg:ml-0")
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[8rem] lg:text-[14rem] font-[900] leading-none select-none pointer-events-none text-foreground/[0.03] tracking-tight">
        EDUCHAINX
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-10 pt-14 lg:pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr] gap-10 lg:gap-8 mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2.5 border border-accent/30 rounded-lg px-5 py-3.5 mb-5">
              <Image
                src="/favicon.ico"
                alt="EduChainX"
                width={28}
                height={28}
                className="rounded-sm"
              />
              <span className="text-[18px] font-bold text-foreground tracking-wide">
                Edu<span className="text-accent">ChainX</span>
              </span>
            </div>
            <p className="text-[11px] lg:text-[12px] leading-[1.8] text-foreground/35 max-w-[260px] mb-6">
              Own your learning. Verify your future. Nigerian university credentials on-chain with real student-ID verification.
            </p>
            <p className="text-[9px] text-foreground/20 tracking-wide">
              Designed by <span className="text-accent/60">EduChainX Team</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-[11px] lg:text-[12px] font-semibold text-accent tracking-[1px] uppercase mb-5 lg:mb-7">
              Community
            </h4>
            <ul className="flex flex-col gap-3.5">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] lg:text-[13px] text-foreground/40 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-[11px] lg:text-[12px] font-semibold text-accent tracking-[1px] uppercase mb-5 lg:mb-7">
              Explore
            </h4>
            <ul className="flex flex-col gap-3.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[12px] lg:text-[13px] text-foreground/40 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-[11px] lg:text-[12px] font-semibold text-accent tracking-[1px] uppercase mb-5 lg:mb-7">
              Subscribe
            </h4>
            <div className="relative mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-[12px] lg:text-[13px] text-foreground/70 placeholder:text-foreground/20 pb-3 border-b border-accent/30 focus:border-accent outline-none transition-colors duration-300 pr-8"
              />
              <button
                className="absolute right-0 bottom-3 text-accent hover:text-foreground transition-colors duration-200"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/30 hover:text-accent hover:border-accent/40 transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border">
          <p className="text-[10px] lg:text-[11px] text-foreground/20">
            &copy; 2026 EduChainX. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-[10px] lg:text-[11px] text-foreground/20 hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[10px] lg:text-[11px] text-foreground/20 hover:text-accent transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      <div className="absolute -right-20 lg:-right-10 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative w-[200px] h-[200px] lg:w-[280px] lg:h-[280px]">
          <div className="absolute inset-0 rounded-full border-[3px] border-accent/25" />
          <div className="absolute inset-5 lg:inset-7 rounded-full border-[2px] border-border" />
          <div className="absolute inset-12 lg:inset-16 rounded-full bg-foreground/[0.03]" />
          <div className="absolute top-4 right-8 lg:top-6 lg:right-12 w-3 h-3 rounded-full bg-accent/60" />
        </div>
      </div>
    </footer>
  );
}
