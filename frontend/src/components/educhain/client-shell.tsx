"use client";

import { PageLoader } from "@/components/educhain/page-loader";
import { ScrollProgress } from "@/components/educhain/scroll-progress";
import { SmoothScroll } from "@/components/educhain/smooth-scroll";

import { SiteFooter } from "@/components/educhain/footer";
import { BottomNav } from "@/components/educhain/bottom-nav";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <SmoothScroll>
        <ScrollProgress />
        {children}
        <SiteFooter />
        <BottomNav />
      </SmoothScroll>
    </>
  );
}
