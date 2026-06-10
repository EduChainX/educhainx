"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Globe,
  Zap,
  ArrowRight,
  Fingerprint,
  GraduationCap,
  Github,
  Twitter,
  MessageCircle,
  Linkedin,
  BookOpen,
  LifeBuoy,
  CheckCircle2,
  Award,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/educhain/theme-toggle';
import { TypingText } from '@/components/educhain/typing-text';
import { cn } from '@/lib/utils';

const TAGLINES = [
  "Credentials that can't be faked or lost.",
  "Real student-ID verification, anchored on Solana.",
  "Certificates employers can trust in seconds.",
  "Your academic identity — permanent and yours.",
];

const FEATURES = [
  {
    icon: Fingerprint,
    title: 'The verified-student gate',
    text:
      'Anyone can build an NFT course marketplace. Ours only lets real, enrolled students in — every account is checked against the institutional registry before a single credential is issued. That gate is the moat, and it is why the credentials actually mean something to an employer.',
    big: true,
  },
  {
    icon: Zap,
    title: 'NFT Certificates',
    text: 'Course completions minted as verifiable NFTs/SFTs straight to your identity — confirmable by anyone, instantly.',
  },
  {
    icon: Globe,
    title: 'Instant Tutor Payments',
    text: 'Trustless SOL payment rails release funds the moment a milestone is met. No middlemen, no waiting.',
  },
];

const HOW_IT_WORKS = [
  {
    title: 'Verify your matric number',
    short: 'Prove you are a real, enrolled student.',
    detail:
      'We check your matriculation number against the institutional registry. This gate is the moat — only genuinely enrolled students get in, so the credentials actually mean something.',
    icon: ShieldCheck,
  },
  {
    title: 'Mint your decentralized identity',
    short: 'A permanent DID, cryptographically yours.',
    detail:
      'Once verified, we anchor a Decentralized Identifier on Solana and bind it to your wallet with a signed challenge. No central database can revoke or forge it.',
    icon: Fingerprint,
  },
  {
    title: 'Earn on-chain certificates',
    short: 'Course completions become verifiable NFTs.',
    detail:
      'Finish a course and the issuer mints a certificate NFT/SFT straight to your identity. Anyone — an employer, a school — can verify it instantly, no transcript requests.',
    icon: GraduationCap,
  },
];

const CAROUSEL_ITEMS = [
  { label: 'Active Students', value: '45,000+' },
  { label: 'NFTs Issued', value: '128,402' },
  { label: 'SOL Volume', value: '12.4k' },
  { label: 'Universities', value: '12' },
  { label: 'Certificates Verified', value: '89,330' },
  { label: 'Instructors', value: '1,204' },
];

export const LandingPage = () => {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Page-wide decorative backdrop: vignette-faded grid + warm glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-fade opacity-70" />
        <div className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[130px]" />
        <div className="absolute -bottom-48 -left-40 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[130px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6 md:gap-8">
            <span className="font-heading text-xl font-bold text-gradient">EduChain</span>
            <div className="hidden items-center gap-6 md:flex">
              <a href="#explore" onClick={scrollTo('explore')} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Explore</a>
              <a href="#how-it-works" onClick={scrollTo('how-it-works')} className="text-sm text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
              <a href="#verification" onClick={scrollTo('verification')} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Verification</a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button onClick={() => navigate('/onboarding')} className="bg-primary text-primary-foreground hover:bg-primary/90">Connect Wallet</Button>
          </div>
        </div>
      </nav>

      {/* Hero — copy + cards side by side */}
      <section className="relative overflow-hidden pb-24 pt-32">
        <div className="absolute inset-0 z-0 bg-gradient-brand" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary">
              <ShieldCheck size={14} />
              Solana-backed Academic Verification
            </div>
            <h1 className="mb-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Own Your Learning.<br />
              <span className="text-gradient">Verify Your Future.</span>
            </h1>
            <p className="mb-4 flex min-h-[2rem] items-center justify-center text-lg font-semibold text-foreground lg:justify-start">
              <TypingText phrases={TAGLINES} />
            </p>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground lg:mx-0">
              EduChain puts Nigerian university credentials on-chain, gated behind real
              student-ID verification. Tokenized courses, instant tutor payouts in SOL, and
              certificates an employer can confirm in seconds — no transcript requests, no
              forgeries, nothing to lose.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" onClick={() => navigate('/onboarding')} className="h-12 w-full bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90 sm:w-auto">
                Start Onboarding <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/marketplace')} className="h-12 w-full px-8 text-base sm:w-auto">
                Explore Courses
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-[12px] text-muted-foreground lg:justify-start">
              <ShieldCheck size={14} className="text-success" />
              Trusted by 12 universities • 45,000+ verified students
            </div>
          </div>

          {/* Right: stacked credential cards */}
          <DemoCards />
        </div>
      </section>

      {/* Explore — bento layout */}
      <section id="explore" className="scroll-mt-20 border-y border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">Why EduChain</span>
            <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">Built around one hard guarantee.</h2>
          </div>
          <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={cn(
                    "group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50",
                    f.big && "md:col-span-2 md:row-span-2"
                  )}
                >
                  {/* gradient reveal on hover */}
                  <div className="absolute inset-0 bg-gradient-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {/* watermark icon */}
                  <Icon
                    className="pointer-events-none absolute -right-6 -top-6 text-primary/5 transition-colors duration-300 group-hover:text-primary/10"
                    size={f.big ? 180 : 110}
                  />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Icon size={f.big ? 26 : 22} />
                    </div>
                    <h3 className={cn("mt-5 font-heading font-semibold", f.big ? "text-2xl" : "text-lg")}>{f.title}</h3>
                  </div>
                  <p className={cn("relative mt-3 leading-relaxed text-muted-foreground", f.big ? "text-base max-w-md" : "text-sm")}>
                    {f.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works — equal-height accordion cards */}
      <section id="how-it-works" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Three steps from enrolled student to globally verifiable credentials.</p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <HowItWorksCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Infinite carousel strip */}
      <section className="marquee-pause overflow-hidden border-y border-border bg-card/30 py-12">
        <div className="flex w-max animate-marquee gap-4">
          {[...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS].map((stat, i) => (
            <div key={i} className="w-56 shrink-0 rounded-lg border border-border bg-card p-6 text-center">
              <div className="font-heading text-2xl font-bold text-gradient">{stat.value}</div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Verify a credential — split: copy + representative visual */}
      <section id="verification" className="scroll-mt-20 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary">For employers & institutions</span>
            <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">Verify a credential</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Confirm any EduChain certificate directly against the institutional registry and the
              Solana chain — no account, no phone calls, no waiting on a transcript office. Paste a
              DID or certificate ID and get a definitive answer in seconds.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Checked against the source university registry, not a copy.',
                'Tamper-proof — records cannot be altered once anchored.',
                'Instant result, with the on-chain proof one click away.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                  {line}
                </li>
              ))}
            </ul>
            <Button size="lg" onClick={() => navigate('/verification')} className="mt-8 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
              Open Verification Registry <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <VerifyVisual />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-heading text-xl font-bold text-gradient">EduChain</span>
            <p className="text-sm text-muted-foreground">© 2026 EduChain Infrastructure. Built for Nigeria.</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, label: 'Twitter' },
              { icon: MessageCircle, label: 'Discord' },
              { icon: Github, label: 'GitHub' },
              { icon: Linkedin, label: 'LinkedIn' },
              { icon: BookOpen, label: 'Docs' },
              { icon: LifeBuoy, label: 'Support' },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                title={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const HowItWorksCard = ({ item, index }: { item: typeof HOW_IT_WORKS[number]; index: number }) => {
  const [open, setOpen] = React.useState(false);
  const Icon = item.icon;
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="group flex h-full min-h-[220px] cursor-pointer flex-col rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon size={22} />
        </div>
        <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
      </div>
      <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{item.short}</p>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <p className="overflow-hidden text-[13px] leading-relaxed text-muted-foreground">{item.detail}</p>
      </div>
    </div>
  );
};

// An awarded "Certificate of Achievement": gold seal + ribbon focal point, double frame,
// recipient + credential, issuer/date footer, and an on-chain verified chip.
const CertificateCard = ({
  recipient,
  credential,
  school,
  date,
  certId,
  className,
}: {
  recipient: string;
  credential: string;
  school: string;
  date: string;
  certId: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative h-[340px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl",
        className
      )}
    >
      {/* soft brand wash + inner frame */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent" />
      <div className="pointer-events-none absolute inset-3 rounded-lg border border-border/60" />
      {/* corner flourishes */}
      <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 rounded-tl-lg border-l-2 border-t-2 border-primary/40" />
      <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 rounded-tr-lg border-r-2 border-t-2 border-primary/40" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-primary/40" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 rounded-br-lg border-b-2 border-r-2 border-primary/40" />
      {/* watermark seal */}
      <Award className="pointer-events-none absolute -bottom-10 -right-8 text-primary/[0.05]" size={190} />

      <div className="relative flex h-full flex-col items-center px-7 py-6 text-center">
        {/* seal medal with ribbon tails */}
        <div className="relative">
          <div className="absolute left-1/2 top-8 z-0 flex -translate-x-1/2 gap-3.5">
            <span
              className="block h-9 w-3 rotate-6 bg-gradient-to-b from-primary to-accent"
              style={{ clipPath: 'polygon(0 0,100% 0,100% 100%,50% 72%,0 100%)' }}
            />
            <span
              className="block h-9 w-3 -rotate-6 bg-gradient-to-b from-primary to-accent"
              style={{ clipPath: 'polygon(0 0,100% 0,100% 100%,50% 72%,0 100%)' }}
            />
          </div>
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-lg ring-4 ring-amber-400/15">
            <div className="flex h-full w-full items-center justify-center rounded-full ring-1 ring-amber-900/25">
              <Award className="h-7 w-7 text-amber-900" />
            </div>
          </div>
        </div>

        <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
          Certificate of Achievement
        </span>
        <div className="mt-3 text-[11px] text-muted-foreground">This certifies that</div>
        <div className="mt-0.5 font-heading text-xl font-bold leading-tight">{recipient}</div>
        <div className="mt-2 text-[11px] text-muted-foreground">has successfully completed</div>
        <div className="mt-0.5 font-semibold text-foreground">{credential}</div>

        {/* footer: issuer / date + verified chip */}
        <div className="mt-auto w-full">
          <div className="flex items-end justify-between border-t border-border/60 pt-3 text-left">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Issued by</div>
              <div className="text-[11px] font-medium">{school}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Date</div>
              <div className="text-[11px] font-medium">{date}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-success/10 py-1.5 text-success">
            <BadgeCheck size={13} />
            <span className="font-mono text-[10px] tracking-wide">{certId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Two stacked award certificates, equal height; hover fans them apart.
const DemoCards = () => (
  <div className="group relative mx-auto h-[380px] w-full max-w-sm lg:mx-0 lg:ml-auto">
    <CertificateCard
      recipient="Dr. Adebayo Williams"
      credential="Distributed Systems"
      school="UNILAG"
      date="Mar 2026"
      certId="did:educhain:4c1a…9f3b"
      className="absolute left-0 top-9 w-[88%] rotate-[-6deg] transition-all duration-300 group-hover:-translate-x-3 group-hover:-rotate-[10deg]"
    />
    <CertificateCard
      recipient="Excel Chimnonso"
      credential="B.Eng Software Engineering"
      school="FUTO"
      date="May 2026"
      certId="did:educhain:8f2a…1b9c"
      className="absolute right-0 top-0 w-[88%] rotate-[4deg] transition-all duration-300 group-hover:translate-x-3 group-hover:rotate-[7deg]"
    />
  </div>
);

// Representative visual for the verify section: a polished "verified" result panel.
const VerifyVisual = () => (
  <div className="relative mx-auto w-full max-w-md">
    <div className="absolute -inset-6 bg-gradient-brand opacity-70 blur-3xl" />
    <div className="relative rounded-xl border border-border bg-card p-6 shadow-2xl">
      <div className="flex items-center justify-center gap-2 rounded-md bg-success/10 py-2 text-success">
        <CheckCircle2 size={16} />
        <span className="text-[11px] font-bold uppercase tracking-widest">Credential Verified</span>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <img src="https://api.dicebear.com/7.x/identicon/svg?seed=excel" alt="" className="h-16 w-16 rounded-lg border border-primary/30 bg-primary/10 p-1.5" />
        <div>
          <div className="text-xl font-bold">Excel Chimnonso</div>
          <div className="text-sm text-muted-foreground">B.Eng Software Engineering</div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
        {[
          { label: 'Institution', value: 'FUTO' },
          { label: 'Graduation', value: '2026' },
          { label: 'Blockchain ID', value: '8xJ4…9a2z', mono: true },
          { label: 'Storage', value: 'ar://82…f21a', mono: true },
        ].map((f) => (
          <div key={f.label}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{f.label}</div>
            <div className={cn("text-sm", f.mono && "font-mono")}>{f.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
        <ShieldCheck size={14} className="text-primary" />
        Anchored on Solana • Non-revocable
      </div>
    </div>
  </div>
);
