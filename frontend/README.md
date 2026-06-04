# EduChain Frontend (Next.js + Solana wallet-adapter)

Student portal, instructor dashboard, and the public credential verifier. App-router,
TypeScript, Tailwind. Wallets via `@solana/wallet-adapter` (Phantom/Solflare) — **not**
RainbowKit/Wagmi, which are EVM-only (see `../DESIGN.md` §3).

## Run

```bash
npm install
cp .env.example .env.local   # points at the Go API on :8080
npm run dev                  # http://localhost:3000
```

## What's here

| Route          | What                                                      |
|----------------|----------------------------------------------------------|
| `/`            | Landing — the pitch + CTA into onboarding                |
| `/onboarding`  | The moat: matric → verify → connect wallet → sign & bind |

## Structure

- `src/components/WalletProviders.tsx` — Solana connection + wallet modal wrapper.
- `src/lib/api.ts` — typed fetch wrapper around the Go API. All endpoints live here.
- `src/app/` — app-router pages.

## Next (see ../todo.txt)

- `/courses` catalog + course detail with a real `buy_course` transaction.
- `/instructor` dashboard to mint NFT/SFT courses.
- `/verify` public cert checker (employer-facing — the money shot for the demo).
