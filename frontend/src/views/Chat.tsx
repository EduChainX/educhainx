"use client";

import React from 'react';
import { Send, Search, ArrowLeft, Users } from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Message = { id: number; from: 'me' | 'them'; text: string; time: string };
type Contact = {
  id: string;
  name: string;
  course: string;
  seed: string;
  online: boolean;
  preview: string;
  messages: Message[];
};

const CONTACTS: Contact[] = [
  {
    id: 'ada',
    name: 'Ada Okeke',
    course: 'Computer Engineering',
    seed: 'ada',
    online: true,
    preview: 'Did you finish the PDA assignment?',
    messages: [
      { id: 1, from: 'them', text: 'Hey! Are you in the Solana cohort?', time: '09:20 AM' },
      { id: 2, from: 'me', text: 'Yeah, module 4 right now.', time: '09:24 AM' },
      { id: 3, from: 'them', text: 'Did you finish the PDA assignment?', time: '09:25 AM' },
    ],
  },
  {
    id: 'emeka',
    name: 'Emeka Bala',
    course: 'Software Engineering',
    seed: 'emeka',
    online: true,
    preview: 'Sharing my notes now 📚',
    messages: [
      { id: 1, from: 'me', text: 'Can you share the security audit notes?', time: 'Yesterday' },
      { id: 2, from: 'them', text: 'Sharing my notes now 📚', time: 'Yesterday' },
    ],
  },
  {
    id: 'zainab',
    name: 'Zainab Yusuf',
    course: 'Data Science',
    seed: 'zainab',
    online: false,
    preview: 'See you at the study group!',
    messages: [
      { id: 1, from: 'them', text: 'Study group at 5pm?', time: 'Mon' },
      { id: 2, from: 'me', text: 'I will be there.', time: 'Mon' },
      { id: 3, from: 'them', text: 'See you at the study group!', time: 'Mon' },
    ],
  },
  {
    id: 'tunde',
    name: 'Tunde Cole',
    course: 'Blockchain Policy',
    seed: 'tunde',
    online: false,
    preview: 'Thanks for the verification link.',
    messages: [
      { id: 1, from: 'me', text: 'Here is the verification registry link.', time: 'Sun' },
      { id: 2, from: 'them', text: 'Thanks for the verification link.', time: 'Sun' },
    ],
  },
];

const avatar = (seed: string) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

/** Student-to-student chat section fixed to the dashboard. */
export const ChatPage = () => {
  const [activeId, setActiveId] = React.useState(CONTACTS[0].id);
  const [threads, setThreads] = React.useState<Record<string, Message[]>>(
    () => Object.fromEntries(CONTACTS.map((c) => [c.id, c.messages]))
  );
  const [draft, setDraft] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [mobileThread, setMobileThread] = React.useState(false); // small-screen: list vs thread
  const endRef = React.useRef<HTMLDivElement>(null);
  const nextId = React.useRef(100);

  const active = CONTACTS.find((c) => c.id === activeId)!;
  const messages = threads[activeId];

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeId]);

  const filtered = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.course.toLowerCase().includes(query.toLowerCase())
  );

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = { id: nextId.current++, from: 'me', text, time: 'Now' };
    setThreads((prev) => ({ ...prev, [activeId]: [...prev[activeId], msg] }));
    setDraft('');
  };

  const openContact = (id: string) => {
    setActiveId(id);
    setMobileThread(true);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-1 mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Users className="text-primary" size={24} /> Student Chat
        </h1>
        <p className="text-sm text-muted-foreground">Connect and collaborate with other verified students.</p>
      </div>

      <div className="flex h-[calc(100vh-12rem)] min-h-[420px] bg-card border border-border rounded-xl overflow-hidden">
        {/* Contacts list */}
        <div
          className={cn(
            "w-full md:w-[300px] md:shrink-0 border-r border-border flex flex-col",
            mobileThread ? "hidden md:flex" : "flex"
          )}
        >
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-input border border-border text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => openContact(c.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 text-left border-b border-border/60 transition-colors",
                  c.id === activeId ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <div className="relative shrink-0">
                  <img src={avatar(c.seed)} alt={c.name} className="h-10 w-10 rounded-full bg-muted" />
                  {c.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-card" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">{c.name}</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground truncate">{c.preview}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No students found.</p>
            )}
          </div>
        </div>

        {/* Thread */}
        <div className={cn("flex-1 flex-col min-w-0", mobileThread ? "flex" : "hidden md:flex")}>
          {/* Thread header */}
          <div className="flex items-center gap-3 px-3 sm:px-5 py-3 border-b border-border bg-background/40">
            <button
              onClick={() => setMobileThread(false)}
              aria-label="Back to list"
              className="md:hidden text-muted-foreground hover:text-foreground shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <img src={avatar(active.seed)} alt={active.name} className="h-9 w-9 rounded-full bg-muted shrink-0" />
            <div className="min-w-0">
              <h2 className="font-bold text-sm truncate">{active.name}</h2>
              <p className="text-[11px] text-muted-foreground truncate">
                {active.online ? 'Online' : 'Offline'} · {active.course}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.from === 'me' ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                    m.from === 'me'
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  <p>{m.text}</p>
                  <span className={cn("block text-[10px] mt-1", m.from === 'me' ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {m.time}
                  </span>
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
                placeholder={`Message ${active.name.split(' ')[0]}...`}
                className="flex-1 h-11 rounded-full bg-input border border-border px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2"
              />
              <Button
                onClick={send}
                size="icon"
                className="h-11 w-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                aria-label="Send message"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
