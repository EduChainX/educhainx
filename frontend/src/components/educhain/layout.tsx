"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  LayoutDashboard,
  ShoppingBag,
  Award,
  UserCircle,
  Settings,
  MessageCircle,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WalletAddressChip, VerifiedStudentBadge } from './shared';
import { ThemeToggle } from './theme-toggle';
import { AiChatWidget } from './ai-chat-widget';

/**
 * App sidebar. On large screens it is always visible and can be minimized to an
 * icon-only rail (no hamburger). On small screens it is an off-canvas drawer
 * toggled by the header hamburger, with a backdrop.
 */
export const Sidebar = ({
  open,
  setOpen,
  collapsed,
  setCollapsed,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) => {
  const pathname = usePathname();
  const { publicKey, disconnect, connected } = useWallet();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
    { icon: Award, label: 'Certificates', path: '/certificates' },
    { icon: UserCircle, label: 'My Identity', path: '/profile' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside
      className={cn(
        // Mobile: fixed off-canvas drawer. Large: in-flow sticky rail so it sits
        // beside the content and scrolls away before the footer (no overlap).
        "fixed lg:sticky top-0 left-0 z-40 lg:z-auto h-screen shrink-0 bg-card border-r border-border flex flex-col transition-all duration-300",
        "w-[240px]",                                  // mobile drawer width
        collapsed ? "lg:w-[76px]" : "lg:w-[240px]",   // large-screen minimize
        open ? "translate-x-0" : "-translate-x-full", // mobile slide in/out
        "lg:translate-x-0"                            // always visible on large
      )}
    >
      <div className={cn("p-4 flex items-center gap-2 mb-4", collapsed ? "lg:justify-center" : "justify-between")}>
        <span className={cn("text-xl font-bold tracking-tight text-primary", collapsed && "lg:hidden")}>EduChain</span>
        {/* Mobile: close drawer */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </Button>
        {/* Large: minimize / expand to icon rail */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
          className="hidden lg:inline-flex text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              title={item.label}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                collapsed && "lg:justify-center lg:px-0",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              <span className={cn("font-medium", collapsed && "lg:hidden")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        {connected && publicKey && (
          <div className={cn("mb-4 space-y-2", collapsed && "lg:hidden")}>
            <VerifiedStudentBadge className="w-full justify-center py-1.5" />
            <WalletAddressChip address={publicKey.toBase58()} className="w-full justify-center py-1.5" />
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => { if (connected) void disconnect(); }}
          disabled={!connected}
          className={cn(
            "w-full text-muted-foreground hover:text-error hover:bg-error/10 gap-3 px-3",
            collapsed ? "lg:justify-center justify-start" : "justify-start"
          )}
        >
          <LogOut size={20} />
          <span className={cn(collapsed && "lg:hidden")}>Disconnect</span>
        </Button>
      </div>
    </aside>
  );
};

/** Standard app layout with a minimizable sidebar and top header bar. */
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans lg:flex">
      <Sidebar open={open} setOpen={setOpen} collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Backdrop — mobile drawer only. */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Content column — flows beside the sticky sidebar on large screens. */}
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — small screens only. */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="lg:hidden text-muted-foreground hover:text-foreground shrink-0"
            >
              <Menu size={20} />
            </Button>
            <h2 className="text-sm font-medium text-muted-foreground truncate">Main Network</h2>
            <div className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-[10px] font-bold shrink-0">
              JD
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* Floating AI assistant (orange button + floating panel). */}
      <AiChatWidget />
    </div>
  );
};
