"use client";

import React from 'react';
import Link from 'next/link';
import { Globe, Check, LogOut, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/educhain/layout';
import { ThemeToggle } from '@/components/educhain/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useLanguage } from '@/lib/LanguageContext';

const LANGUAGES = ['English', 'Français', 'Español', 'Yorùbá', 'Hausa', 'Igbo', 'Kiswahili', 'العربية'];

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

/** Settings page: language, appearance, notifications, account. */
export const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = React.useState(false);
  const [notify, setNotify] = React.useState(false);

  // Reflect the browser's actual notification permission on mount.
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotify(Notification.permission === 'granted');
    }
  }, []);

  // Request notification permission from the browser the user is currently on.
  const onToggleNotify = async () => {
    if (notify) {
      // Browsers don't allow revoking permission programmatically — just mute in-app.
      setNotify(false);
      toast('Notifications muted. Manage the browser permission in your site settings.');
      return;
    }
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('This browser does not support notifications.');
      return;
    }
    if (Notification.permission === 'denied') {
      toast.error('Notifications are blocked in this browser. Re-enable them in your site settings first.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotify(true);
      new Notification('EduChainX', { body: 'Notifications are now enabled in this browser.' });
      toast.success('Notifications enabled for this browser.');
    } else {
      setNotify(false);
      toast.error('Notification permission was not granted.');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{t('settings_title', 'Settings')}</h1>
          <p className="text-sm text-muted-foreground">{t('settings_subtitle', 'Manage your preferences, identity, and account.')}</p>
        </div>

        {/* Language */}
        <Row icon={Globe} title={t('language', 'Language')} desc={t('choose_language', 'Choose your preferred language.')}>
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

        {/* Appearance */}
        <Row icon={Palette} title={t('appearance', 'Appearance')} desc={t('switch_appearance', 'Switch between light and dark mode.')}>
          <ThemeToggle />
        </Row>

        {/* Notifications */}
        <Row icon={Bell} title={t('notifications', 'Notifications')} desc={t('notify_desc', 'Get notified about new certificates and messages in this browser.')}>
          <button
            onClick={onToggleNotify}
            aria-label="Toggle notifications"
            className={cn(
              "relative inline-flex h-8 w-14 items-center rounded-full border border-border transition-colors",
              notify ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-flex h-6 w-6 rounded-full bg-primary-foreground shadow transition-transform",
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
              <h3 className="font-semibold text-sm">{t('account', 'Account')}</h3>
              <p className="text-[12px] text-muted-foreground">{t('disconnect_desc', 'Disconnect your wallet and manage your account.')}</p>
            </div>
          </div>
          <Button asChild variant="destructive" className="gap-2 shrink-0">
            <Link href="/logout"><LogOut size={16} /> {t('disconnect', 'Disconnect')}</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};
