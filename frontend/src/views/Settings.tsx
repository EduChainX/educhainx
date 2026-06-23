"use client";

import React from 'react';
import Link from 'next/link';
import { Globe, Shuffle, Check, LogOut, Palette, Bell } from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { ThemeToggle } from '@/components/educhain/theme-toggle';
import { Button } from '@/components/ui/button';
import { useChatUsername } from '@/lib/useChatUsername';
import { cn } from '@/lib/utils';

const LANGUAGES = ['English', 'Français', 'Yorùbá', 'Hausa', 'Igbo', 'Kiswahili', 'العربية'];

/** A labelled settings row. */
const Row = ({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: any;
  title: string;
  desc: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-card border border-border rounded-xl">
    <div className="flex items-start gap-3 min-w-0">
      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
    </div>
    <div className="shrink-0 self-start sm:self-auto">{children}</div>
  </div>
);

/** Settings page: language, chat username, appearance, notifications, account. */
export const SettingsPage = () => {
  const { username, reshuffle } = useChatUsername();
  const [langOpen, setLangOpen] = React.useState(false);
  const [language, setLanguage] = React.useState('English');
  const [notify, setNotify] = React.useState(true);
  const [justShuffled, setJustShuffled] = React.useState(false);

  const onReshuffle = () => {
    reshuffle();
    setJustShuffled(true);
    setTimeout(() => setJustShuffled(false), 1200);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your preferences, identity, and account.</p>
        </div>

        {/* Language */}
        <Row icon={Globe} title="Language" desc="Choose your preferred language.">
          <div className="relative">
            <Button
              variant="outline"
              className="border-border gap-2 min-w-[140px] justify-between"
              onClick={() => setLangOpen((v) => !v)}
            >
              {language}
              <Globe size={15} />
            </Button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-[180px] max-h-64 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl p-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-left hover:bg-muted transition-colors",
                        lang === language && "text-primary font-medium"
                      )}
                    >
                      {lang}
                      {lang === language && <Check size={15} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </Row>

        {/* Chat username */}
        <Row icon={Shuffle} title="Chat username" desc="Your anonymous handle for student & group chats.">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-md bg-muted border border-border font-mono text-sm">
              {username || '—'}
            </span>
            <Button variant="outline" className="border-border gap-2" onClick={onReshuffle}>
              {justShuffled ? <Check size={15} className="text-success" /> : <Shuffle size={15} />}
              {justShuffled ? 'Done' : 'Reshuffle'}
            </Button>
          </div>
        </Row>

        {/* Appearance */}
        <Row icon={Palette} title="Appearance" desc="Switch between light and dark mode.">
          <ThemeToggle />
        </Row>

        {/* Notifications */}
        <Row icon={Bell} title="Notifications" desc="Get notified about new certificates and messages.">
          <button
            onClick={() => setNotify((v) => !v)}
            aria-label="Toggle notifications"
            className={cn(
              "relative inline-flex h-8 w-14 items-center rounded-full border border-border transition-colors",
              notify ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-flex h-6 w-6 rounded-full bg-white shadow transition-transform",
                notify ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
        </Row>

        {/* Account */}
        <div className="p-4 sm:p-5 bg-card border border-error/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-error/10 text-error flex items-center justify-center shrink-0">
              <LogOut size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm">Account</h3>
              <p className="text-[12px] text-muted-foreground">Disconnect your wallet and manage your account.</p>
            </div>
          </div>
          <Button asChild variant="destructive" className="gap-2 shrink-0">
            <Link href="/logout"><LogOut size={16} /> Disconnect</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};
