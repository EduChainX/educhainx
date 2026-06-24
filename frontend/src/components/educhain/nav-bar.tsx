"use client";

import { Compass, Layers, ShieldCheck, LayoutGrid, Building2, Users, Award } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/lib/LanguageContext";

/** Desktop-only floating navigation bar with expandable icon links. */
export const NavBar = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

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
        "hidden lg:block fixed top-10 left-1/2 p-3 border border-border backdrop-blur-md -translate-x-1/2 z-50 bg-card/95"
      )}
    >
      <nav className="flex items-center gap-4">
        {navItems.map(({ icon: Icon, label, href }) => {
          const translationKey = label === "Explore" ? "explore" :
                                 label === "How It Works" ? "how_it_works" :
                                 label === "Verification" ? "verification" :
                                 label === "Dashboard" ? "dashboard" :
                                 label === "Instructor" ? "instructor" :
                                 label === "Profile" ? "my_identity" : "certificates";
          const translatedLabel = t(translationKey, label);
          return (
            <div
              key={label}
              className="flex items-center pr-3 border-r border-border"
            >
              <Link
                href={href}
                className={cn(
                  "group flex items-center gap-2 overflow-hidden transition-colors duration-200",
                  pathname === href
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-accent hover:bg-accent/10"
                )}
              >
                <Icon
                  size={24}
                  strokeWidth={1.8}
                  className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                />
                <span className="inline-block max-w-0 overflow-hidden opacity-0 whitespace-nowrap text-[1rem] font-semibold ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-in-out group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-1.5">
                  {translatedLabel}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
