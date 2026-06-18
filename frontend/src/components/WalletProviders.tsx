// Solana wallet plumbing. wallet-adapter, NOT RainbowKit/Wagmi — those are EVM-only and the
// whole payment/cert layer is Solana. This wraps the app so any component can useWallet().
"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

/** Solana wallet adapter providers (Phantom + Solflare) on devnet. */
export function WalletProviders({ children }: { children: React.ReactNode }) {
  // devnet for the hackathon — flip to mainnet-beta after audit
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
