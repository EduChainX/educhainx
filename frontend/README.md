# EduChain Frontend (Next.js + Solana wallet-adapter)

The full student/instructor/employer UI. App-router, TypeScript, Tailwind (v3),
shadcn/ui components, with the polished dark "institutional" design system. Wallets via
`@solana/wallet-adapter` (Phantom/Solflare) — **not** RainbowKit/Wagmi, which are EVM-only
(see `../DESIGN.md` §3). Managed with **bun**.

## Run

```bash
bun install
cp .env.example .env.local   # points at the Go API on :8080
bun run dev                  # http://localhost:3000
```

On a low-disk machine, `DISABLE_WEBPACK_CACHE=1 bun run build` skips Next's large
persistent webpack cache.

## Routes

| Route            | What                                                                       |
|------------------|----------------------------------------------------------------------------|
| `/`              | Landing — the pitch + CTAs into onboarding / marketplace                   |
| `/onboarding`    | The moat: matric → verify (real `/verify`) → DID → connect wallet → sign & bind (real `/bind`) |
| `/dashboard`     | Learner dashboard (metrics, continue-learning) — presentational            |
| `/marketplace`   | Course grid, fed by the real `GET /courses` (price from lamports)          |
| `/profile`       | DID identity, credentials/courses/activity tabs — presentational           |
| `/certificates`  | Alias of profile (certificates tab focus)                                  |
| `/settings`      | Alias of profile                                                           |
| `/verification`  | Public employer verifier → real `GET /verify-cert/:did/:course` (backend stub) |
| `/instructor`    | Instructor console (revenue, course table) — presentational                |

## Structure

- `src/app/` — app-router route files (thin; each renders a view).
- `src/views/` — the page components (client components; real wiring lives here).
- `src/components/educhain/` — `layout.tsx` (sidebar/topbar, wired to `useWallet`) and
  `shared.tsx` (WalletAddressChip, DIDString, MetricCard, badges…).
- `src/components/ui/` — shadcn/ui primitives in use (button, input, progress, badge, tabs, sonner).
- `src/components/WalletProviders.tsx` — Solana connection + wallet modal wrapper.
- `src/lib/api.ts` — typed fetch wrapper around the Go API. All endpoints live here.
- `src/app/globals.css` + `tailwind.config.js` — the design tokens (RGB-channel CSS vars
  so Tailwind opacity modifiers work) and Outfit/JetBrains Mono fonts via `next/font`.

## Real vs. placeholder

Wired to the backend: matric **verify**, wallet **bind** (sign challenge), course **list**,
cert **verify**. Presentational/placeholder (no backend endpoint yet): dashboard metrics,
profile credentials, instructor revenue, and course **enroll** (no `buy_course` route).
`/verify-cert` is a backend stub, so results currently report `valid: false`.
