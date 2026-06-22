"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Sliding toggle switch for dark/light theme. */
export const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Default to dark before mount (app default), so the switch never flashes the
  // wrong side on a dark page. Clicking always flips to the opposite mode.
  const isDark = !mounted || resolvedTheme !== 'light';

  return (
    <button
      type="button"
      aria-label="Toggle color mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full border border-border bg-muted transition-colors duration-200",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform duration-200",
          isDark ? "translate-x-1" : "translate-x-7"
        )}
      >
        {isDark ? <Moon size={13} /> : <Sun size={13} />}
      </span>
    </button>
  );
};
