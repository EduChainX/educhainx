"use client";

import React from 'react';
import { Send, Search, ArrowLeft, Users, MessagesSquare, User as UserIcon } from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { Button } from '@/components/ui/button';
import { useChatUsername } from '@/lib/useChatUsername';
import { cn } from '@/lib/utils';

type Message = { id: number; from: 'me' | 'them'; text: string; time: string; sender?: string };
type Conversation = {
  id: string;
  kind: 'direct' | 'group';
  name: string;
  sub: string;          // course (direct) or member summary (group)
  seed: string;
  online: boolean;      // direct: presence. group: shown as "active"
  members?: number;
  preview: string;
  messages: Message[];
};

const DIRECTS: Conversation[] = [
  {
    id: 'ada', kind: 'direct', name: 'Ada Okeke', sub: 'Computer Engineering', seed: 'ada', online: true,
    preview: 'Did you finish the PDA assignment?',
    messages: [
      { id: 1, from: 'them', text: 'Hey! Are you in the Solana cohort?', time: '09:20 AM' },
      { id: 2, from: 'me', text: 'Yeah, module 4 right now.', time: '09:24 AM' },
      { id: 3, from: 'them', text: 'Did you finish the PDA assignment?', time: '09:25 AM' },
    ],
  },
  {
    id: 'emeka', kind: 'direct', name: 'Emeka Bala', sub: 'Software Engineering', seed: 'emeka', online: true,
    preview: 'Sharing my notes now 📚',
    messages: [
      { id: 1, from: 'me', text: 'Can you share the security audit notes?', time: 'Yesterday' },
      { id: 2, from: 'them', text: 'Sharing my notes now 📚', time: 'Yesterday' },
    ],
  },
  {
    id: 'zainab', kind: 'direct', name: 'Zainab Yusuf', sub: 'Data Science', seed: 'zainab', online: false,
    preview: 'See you at the study group!',
    messages: [
      { id: 1, from: 'them', text: 'Study group at 5pm?', time: 'Mon' },
      { id: 2, from: 'me', text: 'I will be there.', time: 'Mon' },
      { id: 3, from: 'them', text: 'See you at the study group!', time: 'Mon' },
    ],
  },
];

const GROUPS: Conversation[] = [
  {
    id: 'solana-cohort', kind: 'group', name: 'Solana Cohort 2026', sub: '128 members', seed: 'solana', online: true, members: 128,
    preview: 'Tunde: Deploying to devnet now 🚀',
    messages: [
      { id: 1, from: 'them', sender: 'Ada Okeke', text: 'Anyone stuck on the PDA derivation?', time: '10:01 AM' },
      { id: 2, from: 'them', sender: 'Emeka Bala', text: 'Use findProgramAddress, not createProgramAddress.', time: '10:03 AM' },
      { id: 3, from: 'me', text: 'That fixed it for me earlier, thanks!', time: '10:05 AM' },
      { id: 4, from: 'them', sender: 'Tunde Cole', text: 'Deploying to devnet now 🚀', time: '10:08 AM' },
    ],
  },
  {
    id: 'unilag', kind: 'group', name: 'UNILAG Students', sub: '342 members', seed: 'unilag', online: true, members: 342,
    preview: 'Zainab: Transcripts are on-chain now!',
    messages: [
      { id: 1, from: 'them', sender: 'Zainab Yusuf', text: 'Transcripts are on-chain now!', time: 'Tue' },
      { id: 2, from: 'me', text: 'Finally 🎉', time: 'Tue' },
    ],
  },
  {
    id: 'study-group', kind: 'group', name: 'Distributed Systems Study', sub: '24 members', seed: 'dsys', online: false, members: 24,
    preview: 'Next session: Saturday 4pm',
    messages: [
      { id: 1, from: 'them', sender: 'Ada Okeke', text: 'Next session: Saturday 4pm', time: 'Sun' },
    ],
  },
];

const ALL = [...DIRECTS, ...GROUPS];
const avatar = (seed: string) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

/** Student chat: direct messages and group chats. */
export const ChatPage = () => {
  const { username } = useChatUsername();
  const [mode, setMode] = React.useState<'direct' | 'group'>('direct');
  const [activeId, setActiveId] = React.useState(DIRECTS[0].id);
  const [threads, setThreads] = React.useState<Record<string, Message[]>>(
    () => Object.fromEntries(ALL.map((c) => [c.id, c.messages]))
  );
  const [draft, setDraft] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [mobileThread, setMobileThread] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const nextId = React.useRef(1000);

  const list = mode === 'direct' ? DIRECTS : GROUPS;
  const active = ALL.find((c) => c.id === activeId)!;
  const messages = threads[activeId];

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeId]);

  const filtered = list.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.sub.toLowerCase().includes(query.toLowerCase())
  );

  const switchMode = (m: 'direct' | 'group') => {
    setMode(m);
    setActiveId((m === 'direct' ? DIRECTS : GROUPS)[0].id);
    setMobileThread(false);
  };

  const openConversation = (id: string) => {
    setActiveId(id);
    setMobileThread(true);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = { id: nextId.current++, from: 'me', text, time: 'Now' };
    setThreads((prev) => ({ ...prev, [activeId]: [...prev[activeId], msg] }));
    setDraft('');
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-1 mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Users className="text-primary shrink-0" size={24} /> Student Chat
        </h1>
        <p className="text-sm text-muted-foreground">
          Chatting as <span className="font-mono text-foreground">{username || '…'}</span> — direct messages and group chats with verified students.
        </p>
      </div>

      <div className="flex h-[calc(100vh-13rem)] min-h-[420px] bg-card border border-border rounded-xl overflow-hidden">
        {/* List panel */}
        <div
          className={cn(
            "w-full md:w-[300px] md:shrink-0 border-r border-border flex flex-col",
            mobileThread ? "hidden md:flex" : "flex"
          )}
        >
          {/* Direct / Groups toggle */}
          <div className="p-2 border-b border-border">
            <div className="grid grid-cols-2 gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => switchMode('direct')}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                  mode === 'direct' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                <UserIcon size={14} /> Direct
              </button>
              <button
                onClick={() => switchMode('group')}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                  mode === 'group' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                <MessagesSquare size={14} /> Groups
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === 'direct' ? 'Search students...' : 'Search groups...'}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-input border border-border text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 text-left border-b border-border/60 transition-colors",
                  c.id === activeId ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <div className="relative shrink-0">
                  <div className={cn("h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center", c.kind === 'group' && "bg-primary/10 text-primary")}>
                    {c.kind === 'group'
                      ? <MessagesSquare size={18} />
                      : <img src={avatar(c.seed)} alt={c.name} className="h-full w-full" />}
                  </div>
                  {c.kind === 'direct' && c.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-card" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-sm truncate block">{c.name}</span>
                  <p className="text-[12px] text-muted-foreground truncate">{c.preview}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">Nothing found.</p>
            )}
          </div>
        </div>

        {/* Thread */}
        <div className={cn("flex-1 flex-col min-w-0", mobileThread ? "flex" : "hidden md:flex")}>
          <div className="flex items-center gap-3 px-3 sm:px-5 py-3 border-b border-border bg-background/40">
            <button
              onClick={() => setMobileThread(false)}
              aria-label="Back to list"
              className="md:hidden text-muted-foreground hover:text-foreground shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div className={cn("h-9 w-9 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0", active.kind === 'group' && "bg-primary/10 text-primary")}>
              {active.kind === 'group'
                ? <MessagesSquare size={17} />
                : <img src={avatar(active.seed)} alt={active.name} className="h-full w-full" />}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm truncate">{active.name}</h2>
              <p className="text-[11px] text-muted-foreground truncate">
                {active.kind === 'group'
                  ? `${active.members} members`
                  : `${active.online ? 'Online' : 'Offline'} · ${active.sub}`}
              </p>
            </div>
          </div>

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
                  {active.kind === 'group' && m.from === 'them' && m.sender && (
                    <span className="block text-[11px] font-semibold text-accent mb-0.5">{m.sender}</span>
                  )}
                  <p>{m.text}</p>
                  <span className={cn("block text-[10px] mt-1", m.from === 'me' ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3 bg-background/40">
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                placeholder={active.kind === 'group' ? `Message ${active.name}...` : `Message ${active.name.split(' ')[0]}...`}
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
