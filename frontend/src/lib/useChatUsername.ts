"use client";

import React from 'react';
import { randomPseudonym } from '@/components/educhain/shared';

const STORAGE_KEY = 'educhainx.chatUsername';
const PREV_KEY = 'educhainx.chatUsername.previous';
const LAST_KEY = 'educhainx.chatUsername.lastReshuffle';

/** A reshuffle is only allowed once every 3 months. */
export const RESHUFFLE_INTERVAL_MS = 1000 * 60 * 60 * 24 * 30 * 3;

export type ReshuffleResult =
  | { ok: true; username: string; previous: string }
  | { ok: false; nextEligible: Date };

/**
 * The user's display name for chat. Persisted in localStorage so it stays
 * stable across sessions. It can be reshuffled to a fresh random handle, but
 * only once every 3 months. When reshuffled, the prior handle is remembered so
 * other people in chat can see the change (e.g. "bikerasta previously runnerplay").
 */
export function useChatUsername() {
  const [username, setUsername] = React.useState<string>('');
  const [previousUsername, setPreviousUsername] = React.useState<string>('');
  const [lastReshuffle, setLastReshuffle] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUsername(stored);
    } else {
      const fresh = randomPseudonym();
      window.localStorage.setItem(STORAGE_KEY, fresh);
      setUsername(fresh);
    }
    setPreviousUsername(window.localStorage.getItem(PREV_KEY) ?? '');
    const last = window.localStorage.getItem(LAST_KEY);
    setLastReshuffle(last ? Number(last) : null);
  }, []);

  /** When the cooldown allows the next reshuffle, or null if it's available now. */
  const nextEligible = React.useMemo<Date | null>(() => {
    if (lastReshuffle == null) return null;
    const next = lastReshuffle + RESHUFFLE_INTERVAL_MS;
    return next > Date.now() ? new Date(next) : null;
  }, [lastReshuffle]);

  const canReshuffle = nextEligible == null;

  const reshuffle = React.useCallback((): ReshuffleResult => {
    const now = Date.now();
    if (lastReshuffle != null && now - lastReshuffle < RESHUFFLE_INTERVAL_MS) {
      return { ok: false, nextEligible: new Date(lastReshuffle + RESHUFFLE_INTERVAL_MS) };
    }
    const prev = username;
    const fresh = randomPseudonym();
    window.localStorage.setItem(STORAGE_KEY, fresh);
    window.localStorage.setItem(PREV_KEY, prev);
    window.localStorage.setItem(LAST_KEY, String(now));
    setUsername(fresh);
    setPreviousUsername(prev);
    setLastReshuffle(now);
    return { ok: true, username: fresh, previous: prev };
  }, [username, lastReshuffle]);

  return { username, previousUsername, canReshuffle, nextEligible, reshuffle };
}
