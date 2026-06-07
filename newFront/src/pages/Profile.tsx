import React from 'react';
import { 
  Cpu, 
  Wallet, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Share2, 
  Settings,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { DIDString, WalletAddressChip, VerifiedStudentBadge } from '@/components/educhain/shared';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const ProfilePage = () => {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-8 text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-3xl bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/identicon/svg?seed=educhain" alt="Avatar" className="w-full h-full" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-card flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">John_Doe.sol</h2>
              <p className="text-muted-foreground text-sm">Computer Engineering @ UNILAG</p>
            </div>

            <div className="flex flex-col gap-3">
              <DIDString did="8f2a1b9c3d4e5f6g7h8i9j" className="justify-center py-2" />
              <WalletAddressChip address="8xJ4n9P2q1mZ...9a2z" className="justify-center py-2" />
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

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
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
          <Tabs defaultValue="credentials" className="space-y-6">
            <TabsList className="bg-card border border-border p-1 h-12">
              <TabsTrigger value="credentials" className="px-8 data-[state=active]:bg-muted">Credentials</TabsTrigger>
              <TabsTrigger value="courses" className="px-8 data-[state=active]:bg-muted">Owned Courses</TabsTrigger>
              <TabsTrigger value="activity" className="px-8 data-[state=active]:bg-muted">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="credentials" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="bg-card border border-border p-6 rounded-xl space-y-4 card-hover">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <Award size={24} />
                      </div>
                      <VerifiedStudentBadge />
                    </div>
                    <div>
                      <h4 className="font-bold leading-tight">Advanced Distributed Systems</h4>
                      <p className="text-[12px] text-muted-foreground mt-1">University of Lagos • Issued Dec 2023</p>
                    </div>
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">ID: #8291...F21A</span>
                      <Button variant="ghost" size="sm" className="h-8 text-[11px] text-primary">
                        View On-Chain <ExternalLink size={12} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
               <div className="bg-card border border-border rounded-xl divide-y divide-border">
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