"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { AlertTriangle, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Confirmation page: delete account and log out, or cancel. */
export const AccountLogout = () => {
  const router = useRouter();
  const { disconnect, connected } = useWallet();
  const [working, setWorking] = React.useState(false);

  const handleDelete = async () => {
    setWorking(true);
    try {
      if (connected) await disconnect();
    } catch {
      /* ignore — we are logging out regardless */
    }
    // Simulate account deletion request, then return to the landing page.
    setTimeout(() => router.push('/'), 900);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error">
            <AlertTriangle size={30} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold">Delete account & log out?</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This will disconnect your wallet and permanently delete your EduChainX account
              and profile data. Your on-chain credentials remain on the blockchain, but your
              account here cannot be recovered.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 border border-border p-3 text-[12px] text-muted-foreground">
          Tip: if you only want to switch wallets, cancel and use the wallet menu instead.
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={working}
            className="w-full gap-2"
          >
            {working ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            {working ? 'Deleting account...' : 'Delete account & log out'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={working}
            className="w-full gap-2 border-border"
          >
            <ArrowLeft size={18} /> Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
