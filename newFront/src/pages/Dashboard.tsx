import React from 'react';
import { 
  BookOpen, 
  Award, 
  Coins, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ExternalLink,
  ChevronRight,
  PlayCircle
} from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { MetricCard, NFTTypePill, OnChainBadge } from '@/components/educhain/shared';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const LearnerDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Welcome back, John!</h1>
              <OnChainBadge />
            </div>
            <p className="text-muted-foreground">You've completed 65% of your current semester goals. Keep it up!</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Button className="bg-primary text-white hover:bg-primary/90">Resume Learning</Button>
            <Button variant="outline" className="border-border">View Certificates</Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard label="Courses Enrolled" value={4} icon={BookOpen} trend="+1 this month" />
          <MetricCard label="Certificates Earned" value={12} icon={Award} trend="+2 new" />
          <MetricCard label="EDU Tokens" value="2,450" icon={Coins} trend="+150" />
          <MetricCard label="Study Hours" value="142" icon={Clock} trend="+12h this week" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Learning Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Continue Learning</h3>
              <Button variant="link" className="text-primary p-0">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  title: "Solana Development for Beginners", 
                  instructor: "Dr. Adebayo", 
                  progress: 75, 
                  lastWatched: "Module 4: PDAs & Accounts",
                  type: "NFT" 
                },
                { 
                  title: "Smart Contract Security Audit", 
                  instructor: "Prof. Okoro", 
                  progress: 30, 
                  lastWatched: "Module 2: Reentrancy Attacks",
                  type: "SFT" 
                }
              ].map((course, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-xl flex items-center gap-6 group hover:border-primary/30 transition-all">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0 relative">
                     <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="text-primary w-10 h-10" />
                     </div>
                     <img src={`https://picsum.photos/seed/${i + 20}/200/200`} className="w-full h-full object-cover" alt={course.title} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <NFTTypePill type={course.type as any} />
                        <h4 className="font-bold group-hover:text-primary transition-colors">{course.title}</h4>
                      </div>
                      <span className="text-[12px] font-medium text-muted-foreground">{course.progress}%</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">Next: <span className="text-foreground">{course.lastWatched}</span></p>
                    <Progress value={course.progress} className="h-1.5 bg-muted" />
                  </div>
                  <ChevronRight className="text-muted-foreground w-5 h-5 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar / Recommended */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Latest Certificates</h3>
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Award size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[13px] font-bold truncate">Blockchain Architecture Prof...</h5>
                    <p className="text-[11px] text-muted-foreground">Issued Oct 12, 2023</p>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground" />
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-accent/10 border border-accent/20 rounded-xl space-y-4">
              <TrendingUp className="text-accent w-6 h-6" />
              <h4 className="font-bold">Upgrade to Premium</h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Get unlimited access to advanced Solana workshops and priority NFT minting rights.
              </p>
              <Button className="w-full bg-accent text-white hover:bg-accent/90 text-[12px] h-9">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};