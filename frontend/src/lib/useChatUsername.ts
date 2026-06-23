"use client";

import React from 'react';
import { randomPseudonym } from '@/components/educhain/shared';

const STORAGE_KEY = 'educhainx.chatUsername';

/**
 * The user's display name for chat. Persisted in localStorage so it stays
 * stable across sessions, and can be reshuffled to a fresh random handle.
 */
export function useChatUsername() {
  const [username, setUsername] = React.useState<string>('');

  React.useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      setUsername(stored);
    } else {
      const fresh = randomPseudonym();
      window.localStorage.setItem(STORAGE_KEY, fresh);
      setUsername(fresh);
    }
  }, []);

  const reshuffle = React.useCallback(() => {
    const fresh = randomPseudonym();
    window.localStorage.setItem(STORAGE_KEY, fresh);
    setUsername(fresh);
    return fresh;
  }, []);

  return { username, reshuffle };
}
