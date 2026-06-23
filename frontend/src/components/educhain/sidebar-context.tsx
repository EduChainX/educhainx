"use client";

import React from "react";

type SidebarContextValue = {
  /** Large-screen rail is minimized to icon-only. */
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  /** True while an AppLayout (and therefore a sidebar) is mounted. */
  hasSidebar: boolean;
  setHasSidebar: (v: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

/**
 * Shares the sidebar's collapsed/presence state across the tree so the globally
 * rendered footer (outside AppLayout) can sit beside the minimized rail or be
 * overlaid by the expanded one.
 */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [hasSidebar, setHasSidebar] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, hasSidebar, setHasSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

/** Read/update the shared sidebar state. Safe to call outside a provider. */
export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    // Footer can render on pages without a sidebar (e.g. landing) — no-op fallback.
    return { collapsed: false, setCollapsed: () => {}, hasSidebar: false, setHasSidebar: () => {} };
  }
  return ctx;
}
