"use client";

import React from 'react';
import {
  ShieldCheck,
  Wallet,
  Cpu,
  UserCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import type { WalletName } from '@solana/wallet-adapter-base';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DIDString, WalletAddressChip } from '@/components/educhain/shared';
import { cn } from '@/lib/utils';
import { verifyMatric, bindWallet } from '@/lib/api';

const steps = [
  { id: 1, title: 'Matriculation', icon: ShieldCheck },
  { id: 2, title: 'DID Creation', icon: Cpu },
  { id: 3, title: 'Wallet Binding', icon: Wallet },
  { id: 4, title: 'Role Selection', icon: UserCircle },
];

export const OnboardingFlow = () => {
  const router = useRouter();
  const { select, connect, connected, connecting, publicKey, signMessage, wallet } = useWallet();

  const [currentStep, setCurrentStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [matric, setMatric] = React.useState('');
  const [did, setDid] = React.useState('');
  const [challenge, setChallenge] = React.useState('');
  const [role, setRole] = React.useState<'learner' | 'instructor' | null>(null);

  // Cosmetic "anchoring" animation when we land on the DID step (the DID itself is real).
  React.useEffect(() => {
    if (currentStep === 2) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(t);
    }
  }, [currentStep]);

  // After the user picks a wallet, connect to it (WalletProvider has autoConnect; this is a safety net).
  React.useEffect(() => {
    if (wallet && !connected && !connecting) {
      connect().catch(() => {});
    }
  }, [wallet, connected, connecting, connect]);

  const handleConnect = (name: string) => {
    try {
      select(name as WalletName);
    } catch {
      toast.error(`Could not select ${name}. Is the wallet installed?`);
    }
  };

  const handleNext = async () => {
    // Step 1 — verify matric against the Go registry, receive DID + signing challenge.
    if (currentStep === 1) {
      if (!matric.trim()) return;
      setLoading(true);
      try {
        const res = await verifyMatric(matric.trim());
        if (!res.verified) {
          toast.error("That matric number isn't in the registry. Double-check it.");
          return;
        }
        setDid(res.did);
        setChallenge(res.challenge);
        setCurrentStep(2);
      } catch {
        toast.error('Backend unreachable — is the Go server running on :8080?');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 2 — DID is anchored; just advance.
    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    // Step 3 — sign the challenge with the connected wallet, then bind it to the DID.
    if (currentStep === 3) {
      if (!publicKey || !signMessage) {
        toast.error('Connect a wallet first.');
        return;
      }
      setLoading(true);
      try {
        const sig = await signMessage(new TextEncoder().encode(challenge));
        const signature = btoa(String.fromCharCode(...sig));
        await bindWallet(did, publicKey.toBase58(), signature);
        toast.success('Wallet bound to your verified identity.');
        setCurrentStep(4);
      } catch {
        toast.error('Signing was rejected.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 4 — role chosen, head to the dashboard.
    if (currentStep === 4) {
      if (!role) return;
      toast.success('Onboarding complete!');
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const nextLabel = currentStep === 4 ? 'Complete' : currentStep === 3 ? 'Sign & Bind' : 'Continue';
  const nextDisabled =
    loading ||
    (currentStep === 1 && !matric) ||
    (currentStep === 3 && !connected) ||
    (currentStep === 4 && !role);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Step Indicator */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                currentStep === step.id
                  ? "bg-primary border-primary text-white"
                  : currentStep > step.id
                    ? "bg-success border-success text-white"
                    : "bg-card border-border text-muted-foreground"
              }`}>
                {currentStep > step.id ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-widest mt-2 ${
                currentStep === step.id ? "text-primary" : "text-muted-foreground"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card border border-border p-8 rounded-xl min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Matriculation Verification</h2>
                  <p className="text-muted-foreground text-sm">Enter your university-issued matriculation number to begin verification.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[12px] uppercase font-bold text-muted-foreground">Matric Number</label>
                    <Input
                      placeholder="e.g. FUTO/2021/12345"
                      value={matric}
                      onChange={(e) => setMatric(e.target.value)}
                      className="h-12 bg-background border-border"
                    />
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-md flex items-start gap-3">
                    <ShieldCheck className="text-primary w-5 h-5 shrink-0" />
                    <p className="text-[12px] text-muted-foreground">
                      This will be verified against the Nigerian University Registry.
                      Your identity will be cryptographically linked to this record.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1 text-center py-4"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">DID Generation</h2>
                  <p className="text-muted-foreground text-sm">Creating your unique decentralized identity on Solana.</p>
                </div>
                <div className="py-8 space-y-4">
                  <div className="relative h-24 flex items-center justify-center">
                    {loading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <div className="space-y-1 text-center">
                          <p className="text-[11px] font-mono text-muted-foreground animate-pulse">Anchoring identity to Solana...</p>
                          <p className="text-[11px] font-mono text-muted-foreground">Issuing verifiable credential...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 className="w-12 h-12 text-success" />
                        <DIDString did={did} />
                      </div>
                    )}
                  </div>
                  {!loading && (
                    <div className="p-4 bg-muted border border-border rounded-md text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase text-muted-foreground">Identity Summary</span>
                        <a href="#" className="text-[10px] text-primary flex items-center gap-1">Explorer <ExternalLink size={10} /></a>
                      </div>
                      <p className="text-[12px] text-foreground/80 leading-relaxed font-mono">
                        Identity successfully anchored. Your DID is now permanent and globally verifiable.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Wallet Binding</h2>
                  <p className="text-muted-foreground text-sm">Connect your Solana wallet to manage your academic credentials.</p>
                </div>
                <div className="space-y-6 py-4">
                  <div className="flex items-center justify-center gap-8 relative">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                      <Cpu size={32} />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-accent to-primary" />
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      <Wallet size={32} />
                    </div>
                  </div>

                  {connected && publicKey ? (
                    <div className="p-4 bg-success/5 border border-success/20 rounded-lg flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-success w-5 h-5" />
                        <span className="text-sm font-medium">Wallet connected</span>
                      </div>
                      <WalletAddressChip address={publicKey.toBase58()} />
                    </div>
                  ) : connecting ? (
                    <div className="p-4 bg-card border border-border rounded-lg flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 bg-muted rounded" />
                        <div className="h-2 w-48 bg-muted rounded" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button variant="outline" onClick={() => handleConnect('Phantom')} className="w-full h-14 justify-start gap-4 px-4 border-border hover:border-primary/50 transition-all">
                        <img src="https://cryptologos.cc/logos/phantom-phantom-logo.png" className="w-6 h-6" alt="Phantom" />
                        <div className="text-left">
                          <div className="text-sm font-bold">Phantom</div>
                          <div className="text-[11px] text-muted-foreground">Connect your Phantom wallet</div>
                        </div>
                      </Button>
                      <Button variant="outline" onClick={() => handleConnect('Solflare')} className="w-full h-14 justify-start gap-4 px-4 border-border hover:border-primary/50 transition-all">
                        <img src="https://cryptologos.cc/logos/solflare-sol-logo.png" className="w-6 h-6" alt="Solflare" />
                        <div className="text-left">
                          <div className="text-sm font-bold">Solflare</div>
                          <div className="text-[11px] text-muted-foreground">Connect your Solflare wallet</div>
                        </div>
                      </Button>
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground text-center italic">
                    Note: signing the challenge binds this wallet to your verified identity.
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Role Selection</h2>
                  <p className="text-muted-foreground text-sm">How do you intend to use EduChain?</p>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <button
                    onClick={() => setRole('learner')}
                    className={cn(
                      "p-6 rounded-xl border transition-all text-left space-y-4",
                      role === 'learner' ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "bg-card border-border hover:border-primary/30"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", role === 'learner' ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                      <BookOpenIcon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Learner</h4>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-1">Enroll in courses, earn NFTs, and build your digital reputation.</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setRole('instructor')}
                    className={cn(
                      "p-6 rounded-xl border transition-all text-left space-y-4",
                      role === 'instructor' ? "bg-accent/10 border-accent shadow-[0_0_20px_rgba(139,92,246,0.1)]" : "bg-card border-border hover:border-accent/30"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", role === 'instructor' ? "bg-accent text-white" : "bg-muted text-muted-foreground")}>
                      <UserCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Instructor</h4>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-1">Teach courses, issue credentials, and receive instant SOL payments.</p>
                    </div>
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] uppercase font-bold text-muted-foreground">Display Name</label>
                  <Input placeholder="John Doe" className="bg-background border-border" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto flex items-center justify-between pt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="text-muted-foreground"
            >
              <ChevronLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={nextDisabled}
              className="bg-primary text-white hover:bg-primary/90 px-8"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {nextLabel} <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookOpenIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
