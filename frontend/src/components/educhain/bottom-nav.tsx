"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ShieldCheck, LayoutGrid, Layers, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

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
  const [mounted, setMounted] = React.useState(false);
  const { theme } = useTheme();
  React.useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === "light";

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col">
      <nav
        className={cn(
          "flex items-center justify-around px-1 pt-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))] border-t backdrop-blur-2xl",
          isLight
            ? "bg-[#FAF2E8]/[0.97] border-[#9E2102]/10"
            : "bg-[#0f0f0f]/[0.97] border-white/[0.08]"
        )}
      >
        {mainItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-[3px] min-w-[48px] px-2.5 py-[5px] rounded-lg transition-colors",
                active
                  ? isLight
                    ? "text-[#E85E1D] bg-[#9E2102]/[0.08]"
                    : "text-[#E85E1D] bg-[#9E2102]/15"
                  : isLight
                    ? "text-[#3c1400]/30"
                    : "text-white/20"
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-[8px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
