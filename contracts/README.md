# EduChain Contracts (Anchor / Solana)

The trustless core. Everything an admin could be bribed to fake lives here instead, enforced
by the program: DID binding, course publish, atomic buy+split, certificate issuance.

## Instructions

| Instruction         | What it does                                                        |
|---------------------|--------------------------------------------------------------------|
| `bind_did`          | Finalize wallet↔DID binding on-chain (the moat)                    |
| `create_course`     | Publish a course; lock price, splits, royalty, content hash        |
| `buy_course`        | Pay → split to tutor + platform atomically → token = receipt       |
| `issue_certificate` | Mint a tamper-proof cert; only on real completion                  |

## State

- `DidRegistry` — `wallet ↔ did_hash`, bound flag, reputation. PDA seeded by student key.
- `Course` — instructor, price, token type (NFT/SFT), supply/sold, royalty/platform bps, content hash.
- `Certificate` — student, course, did_hash, Arweave pointer. PDA seeded by (student, course).

## Build & test

```bash
anchor build
anchor test          # spins a local validator
anchor deploy --provider.cluster devnet
```

## TODO before this is real (see ../todo.txt)

- `create_course` / `buy_course`: CPI to `anchor-spl` for the actual mint + token transfer.
- Royalties: attach Metaplex (`mpl-core`) royalty config at mint.
- `buy_course`: validate `instructor`/`platform` accounts against `course` data.
- `issue_certificate`: tighten the completion `authority` — right now it's too permissive.
- Replace the placeholder program ID after first `anchor build`.
