"use client";

import React from 'react';
import { Award, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { AppLayout } from '@/components/educhain/layout';
import { VerifiedStudentBadge } from '@/components/educhain/shared';
import { Button } from '@/components/ui/button';

const CERTS = [
  { title: 'Advanced Distributed Systems', org: 'University of Lagos', issued: 'Dec 2023', id: '8291...F21A' },
  { title: 'Smart Contract Security', org: 'FUTO', issued: 'Oct 2023', id: '4417...A93C' },
  { title: 'Solana Program Architecture', org: 'University of Lagos', issued: 'Aug 2023', id: '1029...77BE' },
  { title: 'Blockchain Policy & Ethics', org: 'Covenant University', issued: 'May 2023', id: 'C0FE...1183' },
];

/** Certificates page: the user's on-chain academic credentials. */
export const CertificatesPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Award className="text-primary shrink-0" size={26} /> My Certificates
            </h1>
            <p className="text-sm text-muted-foreground">Tamper-proof academic credentials anchored on Solana.</p>
          </div>
          <Button variant="outline" className="border-border gap-2 shrink-0">
            <Download size={16} /> Export all
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total', value: CERTS.length },
            { label: 'Verified', value: CERTS.length },
            { label: 'Institutions', value: 3 },
            { label: 'Revoked', value: 0 },
          ].map((s) => (
            <div key={s.label} className="p-4 bg-card border border-border rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{s.value}</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Certificate cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CERTS.map((cert, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg border border-border p-5 sm:p-6 space-y-4 card-hover"
            >
              <img
                src={`https://picsum.photos/seed/cred${i + 30}/600/400`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-25 transition-all duration-300 group-hover:opacity-40 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-card/60 transition-colors duration-300 group-hover:from-card group-hover:via-card/80" />
              <div className="relative flex items-start justify-between gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/15 text-primary backdrop-blur-sm shrink-0">
                  <Award size={24} />
                </div>
                <VerifiedStudentBadge />
              </div>
              <div className="relative">
                <h4 className="font-bold leading-tight">{cert.title}</h4>
                <p className="text-[12px] text-muted-foreground mt-1">{cert.org} • Issued {cert.issued}</p>
              </div>
              <div className="relative pt-4 border-t border-border flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-muted-foreground truncate">ID: #{cert.id}</span>
                <Button variant="ghost" size="sm" className="h-8 text-[11px] text-primary shrink-0">
                  View On-Chain <ExternalLink size={12} className="ml-1.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <ShieldCheck size={14} className="text-success shrink-0" />
          All certificates are verified directly against issuing institutions.
        </div>
      </div>
    </AppLayout>
  );
};
