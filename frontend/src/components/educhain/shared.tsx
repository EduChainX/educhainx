"use client";

import React from 'react';
import { Copy, ShieldCheck, Cpu, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/** Truncated wallet address with click-to-copy. */
export const WalletAddressChip = ({ address, className }: { address: string; className?: string }) => {
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  const copy = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  return (
    <div 
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 px-2 py-1 bg-muted border border-border rounded-md font-mono text-[12px] cursor-pointer hover:bg-muted/80 transition-colors",
        className
      )}
    >
      <span className="text-foreground/90">{truncated}</span>
      <Copy className="w-3 h-3 text-muted-foreground" />
    </div>
  );
};

/** Green "Verified Student" pill badge. */
export const VerifiedStudentBadge = ({ className }: { className?: string }) => (
  <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded-full text-[11px] font-medium", className)}>
    <ShieldCheck className="w-3 h-3" />
    <span>Verified Student</span>
  </div>
);

/** Truncated DID display with accent styling. */
export const DIDString = ({ did, className }: { did: string; className?: string }) => {
  const truncated = `did:educhain:${did.slice(0, 8)}...`;
  
  return (
    <div className={cn("inline-flex items-center gap-2 px-2 py-1 bg-accent/10 border border-accent/20 rounded-md font-mono text-[12px] text-accent", className)}>
      <Cpu className="w-3 h-3" />
      <span>{truncated}</span>
    </div>
  );
};

/** Animated "On-Chain Verified" status badge. */
export const OnChainBadge = ({ className }: { className?: string }) => (
  <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-medium", className)}>
    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
    <span>On-Chain Verified</span>
  </div>
);

/** Dashboard metric card with icon, value, and trend indicator. */
export const MetricCard = ({ label, value, icon: Icon, trend }: { label: string; value: string | number; icon: any; trend?: string }) => (
  <div className="p-4 bg-card border border-border rounded-lg card-hover">
    <div className="flex items-center justify-between mb-2">
      <span className="text-muted-foreground text-[12px] font-medium uppercase tracking-wider">{label}</span>
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold">{value}</span>
      {trend && <span className="text-success text-[12px] pb-1">{trend}</span>}
    </div>
  </div>
);

/** Shimmer loading placeholder. */
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("skeleton", className)} />
);

// Google-games-style pseudonym, derived deterministically from a wallet address so it's
// stable per user without storing anything. Gives the pseudo-anonymous identity a friendly name.
const ADJECTIVES = [
  'Swift', 'Brave', 'Clever', 'Lunar', 'Golden', 'Cosmic', 'Silent', 'Bold',
  'Noble', 'Rapid', 'Vivid', 'Mighty', 'Gentle', 'Radiant', 'Stellar', 'Wise',
];
const ANIMALS = [
  'Falcon', 'Otter', 'Panther', 'Heron', 'Lynx', 'Gecko', 'Mantis', 'Marlin',
  'Bison', 'Cobra', 'Wren', 'Jaguar', 'Ibis', 'Stag', 'Orca', 'Raven',
];

/** Derives a stable pseudonym (e.g. "SwiftFalcon123") from a wallet address. */
export function pseudonymFromAddress(address: string): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash * 31 + address.charCodeAt(i)) >>> 0;
  }
  const adj = ADJECTIVES[hash % ADJECTIVES.length];
  const animal = ANIMALS[(hash >> 8) % ANIMALS.length];
  const num = (hash >> 16) % 900 + 100;
  return `${adj}${animal}${num}`;
}

/** NFT or SFT type indicator pill. */
export const NFTTypePill = ({ type }: { type: 'NFT' | 'SFT' }) => (
  <span className={cn(
    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
    type === 'NFT' ? "bg-accent/20 text-accent border border-accent/30" : "bg-primary/20 text-primary border border-primary/30"
  )}>
    {type}
  </span>
);