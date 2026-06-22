"use client";

import React from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  FileSearch,
  ExternalLink,
  Database,
  X
} from 'lucide-react';
import { ThemeToggle } from '@/components/educhain/theme-toggle';
import { Skeleton } from '@/components/educhain/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { verifyCert } from '@/lib/api';

/** Public employer verification page for checking credentials against the on-chain registry. */
export const VerificationPage = () => {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [note, setNote] = React.useState('');

  const handleVerify = async () => {
    if (!query) return;
    setStatus('loading');
    setNote('');
    // Query format: "<did> <courseId>" (space or slash separated). The backend route is
    // GET /verify-cert/:did/:course — see src/lib/api.ts.
    const [did, course = ''] = query.trim().split(/[\s/]+/);
    try {
      const res = await verifyCert(did, course);
      setNote(res.note ?? '');
      setStatus(res.valid ? 'valid' : 'invalid');
    } catch {
      setNote('Registry unreachable — is the Go API running on :8080?');
      setStatus('invalid');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Public Navbar */}
      <nav className="border-b border-border bg-card/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-gradient">EduChain <span className="text-muted-foreground font-medium text-sm ml-2">Verification Registry</span></span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Exit to main site"
              title="Exit to main site"
              onClick={() => window.history.back()}
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-[12px] font-medium mb-2">
            <Database size={14} />
            Official Institutional Registry
          </div>
          <h1 className="text-4xl font-bold">Employer Verification</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Instantly verify academic credentials using Decentralized Identifiers (DID) 
            or Certificate IDs. All records are permanently anchored on Solana.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Enter DID or Certificate ID (e.g. did:educhain:8f2a...)"
                className="h-14 pl-12 bg-card border-border text-sm sm:text-lg placeholder:text-xs sm:placeholder:text-sm placeholder:truncate"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleVerify} disabled={status === 'loading'} className="h-14 px-8 bg-primary text-white hover:bg-primary/90">
              {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center italic">
            Search Tip: Enter a DID and Course ID, e.g. <span className="font-mono">did:educhain:8f2a c_1</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Skeleton className="h-8 w-full rounded-none" />
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-16 w-16 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-border flex items-center gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {status === 'valid' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border border-success/30 rounded-2xl overflow-hidden"
            >
              <div className="p-1 bg-success/20 border-b border-success/30 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-[11px] font-bold text-success uppercase tracking-wider">Credential Verified</span>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">John Doe</h3>
                    <p className="text-muted-foreground">B.Eng Computer Engineering</p>
                  </div>
                  <img src="https://api.dicebear.com/7.x/identicon/svg?seed=educhain" className="w-16 h-16 rounded-lg bg-accent/10 p-2" alt="Student" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {[
                    { label: 'Institution', value: 'University of Lagos (UNILAG)' },
                    { label: 'Graduation Year', value: '2023' },
                    { label: 'Blockchain ID', value: '8xJ4...9a2z', mono: true },
                    { label: 'Arweave Storage', value: 'ar://8291...f21a', mono: true },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.label}</span>
                      <p className={cn("text-sm", item.mono && "font-mono")}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-success/5 text-success border-success/20">Active Status</Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Non-Revocable</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary gap-2">
                    View on Explorer <ExternalLink size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'invalid' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-12 text-center bg-card border border-destructive/20 rounded-2xl space-y-4"
            >
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
                <XCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Credential Not Found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  The provided ID could not be matched with any institutional record in the EduChain registry.
                </p>
                {note && <p className="text-[11px] font-mono text-muted-foreground max-w-sm mx-auto">{note}</p>}
              </div>
              <Button variant="outline" onClick={() => setStatus('idle')} className="mt-4">Try Another ID</Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            { icon: ShieldCheck, title: "Tamper-Proof", text: "Records cannot be altered once anchored." },
            { icon: FileSearch, title: "Instant Access", text: "No more waiting for physical transcript copies." },
            { icon: Database, title: "Direct Source", text: "Verified directly against university databases." },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-card border border-border rounded-xl space-y-3">
              <item.icon className="w-6 h-6 text-primary" />
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};