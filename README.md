# EduChainx

> We make Nigerian university certificates impossible to fake and impossible to lose —
> by putting them on-chain, gated behind real student-ID verification.

A decentralized education platform for Nigerian university students. Courses are
tokenized as NFTs/SFTs on Solana, certificates are issued on-chain by smart contracts,
and the whole thing is gated behind an **institutional student-ID verification layer** —
that gate is the moat. Anyone can build an NFT course marketplace; ours only lets *real
enrolled students* in, so the credentials actually mean something to an employer.

Built for **Hack4FUTO 5.0**.

## What's in here

| Path         | What it is                                                        |
|--------------|-------------------------------------------------------------------|
| `DESIGN.md`  | Full system design — architecture, data models, flows, decisions |
| `todo.txt`   | Step-by-step build roadmap from scaffold → demo                   |
| `backend/`   | Go (Gin) API — student verification, DID issuance, course API     |
| `frontend/`  | Next.js + Solana wallet-adapter — student & instructor portals    |
| `contracts/` | Anchor (Rust) — course mint, buy-and-split, certificate issuance  |

## Quick start

Each folder has its own README with run instructions. Start with `DESIGN.md`, then
follow `todo.txt` top to bottom.

```bash
# backend
cd backend && go run ./cmd/server

# frontend
cd frontend && npm install && npm run dev

# contracts
cd contracts && anchor build && anchor test
```
