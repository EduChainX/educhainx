"use client";

import React from 'react';
import { cn } from '@/lib/utils';

// Typewriter that cycles through `phrases`: types one out, holds, deletes, advances.
export const TypingText = ({
  phrases,
  className,
  typingSpeed = 45,
  deleteSpeed = 25,
  holdMs = 2200,
}: {
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deleteSpeed?: number;
  holdMs?: number;
}) => {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState('');
  const [phase, setPhase] = React.useState<'typing' | 'holding' | 'deleting'>('typing');

  React.useEffect(() => {
    const current = phrases[index % phrases.length];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setPhase('deleting'), holdMs);
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
      } else {
        setIndex((i) => i + 1);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timer);
  }, [text, phase, index, phrases, typingSpeed, deleteSpeed, holdMs]);

  return <span className={cn("type-caret", className)}>{text}</span>;
};
