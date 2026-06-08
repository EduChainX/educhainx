"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ChevronRight,
  Globe,
  Zap,
  Lock,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnChainBadge } from '@/components/educhain/shared';

export const LandingPage = () => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-primary tracking-tight">EduChain</span>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Verification</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm">Sign In</Button>
            <Button onClick={() => navigate('/onboarding')} className="bg-primary text-white hover:bg-primary/90">Connect Wallet</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/d43e3d7b-0ec7-4738-b7de-02407b6a43c4/hero-bg-edu-chain-webp-c2492a05-1780367125625.webp" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[12px] font-medium mb-8">
            <ShieldCheck size={14} />
            Solana-backed Academic Verification
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Own Your Learning. <br />
            <span className="text-primary">Verify Your Future.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The decentralized academic infrastructure for Nigerian university students. 
            Verifiable credentials, secure tutor payments, and permanent identity on the Solana blockchain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/onboarding')} className="h-12 px-8 text-base bg-primary text-white hover:bg-primary/90 w-full sm:w-auto">
              Start Onboarding <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/marketplace')} className="h-12 px-8 text-base border-border hover:bg-muted w-full sm:w-auto">
              Explore Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="py-20 border-y border-white/5 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Fingerprint size={20} />
              </div>
              <h3 className="text-lg font-bold">Decentralized Identity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your academic history tied to a permanent, unforgeable DID linked to your matriculation number.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold">NFT Certificates</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Course completions issued as verifiable SFTs or NFTs, instantly verifiable by employers worldwide.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center text-success">
                <Globe size={20} />
              </div>
              <h3 className="text-lg font-bold">Instant Tutor Payments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trustless payment rails on Solana ensure tutors get paid instantly when milestones are met.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Students', value: '45,000+' },
            { label: 'NFTs Issued', value: '128,402' },
            { label: 'SOL Volume', value: '12.4k' },
            { label: 'Verified Partners', value: '12 Universities' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-[12px] text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold text-primary">EduChain</span>
            <p className="text-sm text-muted-foreground">© 2024 EduChain Infrastructure. Built for Nigeria.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Discord</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Docs</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};