"use client";

import React from 'react';
import { 
  Users, 
  DollarSign, 
  Award, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  Layout
} from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { MetricCard } from '@/components/educhain/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const InstructorDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Instructor Console</h1>
            <p className="text-muted-foreground">Manage your curriculum, student verification, and revenue.</p>
          </div>
          <Button className="bg-primary text-white hover:bg-primary/90 gap-2 h-11 px-6">
            <Plus size={20} /> Create New Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Total Revenue" value="124.5 SOL" icon={DollarSign} trend="+12.4% this month" />
          <MetricCard label="Active Students" value="1,842" icon={Users} trend="+84 new" />
          <MetricCard label="Certificates Issued" value="412" icon={Award} trend="+12 pending" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Your Courses</h3>
              <Button variant="ghost" className="text-muted-foreground text-sm">View Archive</Button>
            </div>
            
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Course Name</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Enrolled</th>
                    <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Revenue</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: 'Solana Architecture', status: 'Live', enrolled: 450, revenue: '45.0 SOL' },
                    { name: 'Rust Fundamentals', status: 'Live', enrolled: 820, revenue: '62.4 SOL' },
                    { name: 'DeFi Governance', status: 'Draft', enrolled: 0, revenue: '0.0 SOL' },
                  ].map((course, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm">{course.name}</div>
                        <div className="text-[11px] text-muted-foreground">Modified 2 days ago</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={cn(
                          "bg-card text-[10px] h-5",
                          course.status === 'Live' ? "text-success border-success/30" : "text-warning border-warning/30"
                        )}>
                          {course.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{course.enrolled}</td>
                      <td className="p-4 text-sm font-mono">{course.revenue}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <MoreVertical size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Pending Actions</h3>
            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
              {[
                { student: 'Chinedu O.', action: 'Verify Completion', time: '14m ago' },
                { student: 'Fatima A.', action: 'Grade Assignment', time: '2h ago' },
                { student: 'Babatunde L.', action: 'Sign Certificate', time: '5h ago' },
              ].map((item, i) => (
                <div key={i} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                        {item.student.split(' ')[0][0]}{item.student.split(' ')[1][0]}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold">{item.student}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock size={10} /> {item.time}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-[11px] text-primary hover:bg-primary/10">Process</Button>
                  </div>
                  <div className="p-2 bg-muted rounded text-[11px] font-medium text-foreground/80 flex items-center gap-2">
                    <Layout size={12} className="text-muted-foreground" />
                    {item.action}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-primary" />
                <h4 className="font-bold text-sm">Instructor Score: 98%</h4>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Your student satisfaction rate is in the top 5%. You're eligible for the Platform Grant program.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};