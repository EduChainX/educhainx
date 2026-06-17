"use client";

import { useState, useEffect } from "react";
import { Compass, Layers, ShieldCheck, LayoutGrid, Building2, Users, Award } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const NavBar = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  useEffect(() => setMounted(true), []);
  const isLight = mounted && theme === "light";

  const navItems = [
    { icon: Compass, label: "Explore", href: "/marketplace" },
    { icon: Layers, label: "How It Works", href: "/#how-it-works" },
    { icon: ShieldCheck, label: "Verification", href: "/verification" },
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
    { icon: Building2, label: "Instructor", href: "/instructor" },
    { icon: Users, label: "Profile", href: "/profile" },
    { icon: Award, label: "Certificates", href: "/certificates" },
  ];

  return (
    <div
      className={cn(
        "hidden lg:block fixed top-10 left-1/2 p-3 border backdrop-blur-md -translate-x-1/2 z-50",
        isLight
          ? "bg-[#FAF2E8]/95 border-[#9E2102]/15"
          : "bg-[#111111]/95 border-white/40"
      )}
    >
      <nav className="flex items-center gap-4">
        {navItems.map(({ icon: Icon, label, href }) => (
          <div
            key={label}
            className={cn(
              "flex items-center pr-3 border-r",
              isLight ? "border-r-[#9E2102]/15" : "border-r-white/40"
            )}
          >
            <Link
              href={href}
              className={cn(
                "group flex items-center gap-2 overflow-hidden transition-colors duration-200",
                pathname === href
                  ? "text-[#E85E1D] bg-[#E85E1D]/10"
                  : isLight
                    ? "text-[#1a0a00]/35 hover:text-[#E85E1D] hover:bg-[#E85E1D]/10"
                    : "text-white/40 hover:text-[#E85E1D] hover:bg-[#E85E1D]/10"
              )}
            >
              <Icon
                size={24}
                strokeWidth={1.8}
                className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
              />
              <span className="inline-block max-w-0 overflow-hidden opacity-0 whitespace-nowrap text-[1rem] font-semibold ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-in-out group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-1.5">
                {label}
              </span>
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};
