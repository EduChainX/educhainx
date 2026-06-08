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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WalletAddressChip, VerifiedStudentBadge } from './shared';

export const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) => {
  const pathname = usePathname();
  const { publicKey, disconnect, connected } = useWallet();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
    { icon: Award, label: 'Certificates', path: '/certificates' },
    { icon: UserCircle, label: 'My Identity', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={cn(
      "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0",
      collapsed ? "w-[72px]" : "w-[240px]"
    )}>
      <div className="p-4 flex items-center justify-between mb-4">
        {!collapsed && <span className="text-xl font-bold tracking-tight text-primary">EduChain</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        {!collapsed && connected && publicKey && (
          <div className="mb-4 space-y-2">
            <VerifiedStudentBadge className="w-full justify-center py-1.5" />
            <WalletAddressChip address={publicKey.toBase58()} className="w-full justify-center py-1.5" />
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => { if (connected) void disconnect(); }}
          disabled={!connected}
          className={cn("w-full justify-start text-muted-foreground hover:text-error hover:bg-error/10 gap-3 px-3", collapsed && "justify-center")}
        >
          <LogOut size={20} />
          {!collapsed && <span>Disconnect</span>}
        </Button>
      </div>
    </aside>
  );
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-muted-foreground">Main Network</h2>
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-[10px] font-bold">
              JD
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
