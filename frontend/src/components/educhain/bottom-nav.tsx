"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ShieldCheck, LayoutGrid, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/lib/LanguageContext";

const mainItems = [
  { icon: Compass, label: "Explore", href: "/marketplace" },
  { icon: ShieldCheck, label: "Verify", href: "/verification" },
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
  { icon: Layers, label: "How", href: "/#how-it-works" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

/**
 * Mobile-only bottom navigation bar. The former "More" drawer (Instructor,
 * Profile, Certificates) now lives in the app sidebar; this bar exposes the
 * primary destinations plus quick access to Settings.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col">
      <nav
        className="flex items-center justify-around px-1 pt-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))] border-t border-border backdrop-blur-2xl bg-card/[0.97]"
      >
        {mainItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          const translationKey = label === "Explore" ? "explore" :
                                 label === "Verify" ? "verification" :
                                 label === "Dashboard" ? "dashboard" :
                                 label === "How" ? "how_it_works" : "settings";
          const translatedLabel = t(translationKey, label);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-[3px] min-w-[48px] px-2.5 py-[5px] rounded-lg transition-colors",
                active
                  ? "text-accent bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-[8px] font-semibold">{translatedLabel}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
