"use client";

import React from 'react';
import { Send, Bot, User, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Message = { id: number; from: 'user' | 'bot'; text: string };

const GREETING: Message = {
  id: 0,
  from: 'bot',
  text: "Hi! I'm the EduChainX AI assistant. Ask me about your credentials, courses, or how on-chain verification works.",
};

/**
 * Floating AI chat. The orange button at the bottom toggles a floating panel.
 * Closes via the exit icon or by tapping the backdrop (outside the panel).
 */
export const AiChatWidget = () => {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([GREETING]);
  const [draft, setDraft] = React.useState('');
  const endRef = React.useRef<HTMLDivElement>(null);
  const nextId = React.useRef(1);

  React.useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const userMsg: Message = { id: nextId.current++, from: 'user', text };
    const botMsg: Message = {
      id: nextId.current++,
      from: 'bot',
      text: `You said: "${text}". (This is a demo assistant — real responses are coming soon.)`,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setDraft('');
  };

  return (
    <>
      {/* Backdrop — tap anywhere outside the panel to exit. */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          aria-hidden="true"
        />
      )}

      {/* Floating panel */}
      {open && (
        <div
          role="dialog"
          aria-label="AI assistant chat"
          className="fixed z-50 right-3 sm:right-6 bottom-24 lg:bottom-24 left-3 sm:left-auto sm:w-[380px] h-[70vh] max-h-[560px] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-background/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                <Bot size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm truncate">EduChainX AI</h2>
                <p className="text-[11px] text-success flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-end gap-2",
                  m.from === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                    m.from === 'user' ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                  )}
                >
                  {m.from === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    m.from === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-border p-3 bg-background/40">
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                placeholder="Ask the assistant..."
                className="flex-1 h-10 rounded-full bg-input border border-border px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2"
              />
              <Button
                onClick={send}
                size="icon"
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                aria-label="Send message"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Orange floating action button — hidden while the panel is open so it
          never overlaps the panel/composer on small screens. */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI chat"
          title="Chat with the AI assistant"
          className="fixed right-4 sm:right-6 bottom-24 lg:bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/40 hover:bg-accent/90 hover:scale-105 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </>
  );
};
