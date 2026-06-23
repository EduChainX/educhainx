"use client";

import React from 'react';
import {
  Cpu,
  Award,
  BookOpen,
  Share2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { DIDString, WalletAddressChip, pseudonymFromAddress } from '@/components/educhain/shared';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@solana/wallet-adapter-react';
import { cn } from '@/lib/utils';

/** User profile with DID, wallet info, credentials, owned courses, and activity timeline. */
export const ProfilePage = () => {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() ?? '8xJ4n9P2q1mZexampleaddr9a2z';
  const handle = `${pseudonymFromAddress(address)}.sol`;

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card — sticky, no overlay */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 z-0">
          <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-3xl bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/identicon/svg?seed=educhain" alt="Avatar" className="w-full h-full" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-card flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{handle}</h2>
              <p className="text-muted-foreground text-sm">Computer Engineering @ UNILAG</p>
            </div>

            <div className="flex flex-col gap-3">
              <DIDString did="8f2a1b9c3d4e5f6g7h8i9j" className="justify-center py-2" />
              <WalletAddressChip address={address} className="justify-center py-2" />
            </div>

            <div className="pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold">840</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Reputation</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">12</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Certificates</div>
              </div>
            </div>

            <Button variant="outline" className="w-full border-border gap-2">
              <Share2 size={16} /> Share Profile
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Verification Stats</h4>
            <div className="space-y-3">
              {[
                { label: 'Registry Match', status: 'Verified', color: 'text-success' },
                { label: 'DID Anchored', status: 'Solana', color: 'text-primary' },
                { label: 'Biometric Link', status: 'Pending', color: 'text-warning' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={cn("font-medium", item.color)}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="identity" className="space-y-6">
            <TabsList className="w-full bg-card border border-border p-1 h-12">
              <TabsTrigger value="identity" className="flex-1 px-2 sm:px-8 text-xs sm:text-sm data-[state=active]:bg-muted">Identity</TabsTrigger>
              <TabsTrigger value="courses" className="flex-1 px-2 sm:px-8 text-xs sm:text-sm data-[state=active]:bg-muted">Owned Courses</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 px-2 sm:px-8 text-xs sm:text-sm data-[state=active]:bg-muted">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-success shrink-0" size={20} />
                  <h3 className="font-bold">Decentralized Identity</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">DID</span>
                    <DIDString did="8f2a1b9c3d4e5f6g7h8i9j" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Wallet</span>
                    <WalletAddressChip address={address} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                  {[
                    { label: 'Institution', value: 'University of Lagos' },
                    { label: 'Program', value: 'Computer Engineering' },
                    { label: 'Anchor Network', value: 'Solana Mainnet' },
                    { label: 'Status', value: 'Active' },
                  ].map((d) => (
                    <div key={d.label} className="space-y-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{d.label}</span>
                      <p className="text-sm font-medium truncate">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-5 sm:p-6 space-y-3">
                <h4 className="font-bold text-sm">Verification Checks</h4>
                {[
                  { label: 'Registry Match', status: 'Verified', color: 'text-success', icon: CheckCircle2 },
                  { label: 'DID Anchored', status: 'On Solana', color: 'text-primary', icon: Cpu },
                  { label: 'Biometric Link', status: 'Pending', color: 'text-warning', icon: ShieldCheck },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground min-w-0">
                      <item.icon size={15} className={cn("shrink-0", item.color)} /> <span className="truncate">{item.label}</span>
                    </span>
                    <span className={cn("font-medium shrink-0", item.color)}>{item.status}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
               <div className="bg-card border border-border rounded-lg divide-y divide-border">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                           <img src={`https://picsum.photos/seed/${i + 100}/200/200`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold">Solana Program Architecture</h4>
                          <p className="text-sm text-muted-foreground">Instructor: Dr. Adebayo</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-success">Completed</div>
                        <div className="text-[11px] text-muted-foreground">Earned NFT #1029</div>
                      </div>
                    </div>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {[
                  { title: 'Certificate Issued', desc: 'Solana Advanced Program', time: '2 days ago', icon: Award, color: 'text-primary' },
                  { title: 'Identity Anchored', desc: 'DID successfully registered on Solana', time: '1 week ago', icon: Cpu, color: 'text-accent' },
                  { title: 'Course Enrolled', desc: 'Distributed Systems 101', time: '2 weeks ago', icon: BookOpen, color: 'text-success' },
                ].map((item, i) => (
                  <div key={i} className="relative pl-10">
                    <div className={cn("absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center z-10", "bg-card")}>
                       <item.icon size={12} className={item.color} />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold">{item.title}</h5>
                      <p className="text-[12px] text-muted-foreground">{item.desc}</p>
                      <span className="text-[10px] text-muted-foreground uppercase">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};