# EduChain — System Design

**Hack4FUTO 5.0 · v1.0**

> "Math doesn't lie. Blockchain doesn't accept bribes. That's the whole point."

---

## 1. The Problem (why this needs a blockchain)

Four real, Nigeria-specific failures — not a generic global edtech pitch:

1. **Certificate fraud is an open secret.** Degrees, NYSC certs, professional certs —
   faked in Photoshop, resubmitted, undetectable without weeks of phoning the issuing
   institution. Verification depends on trusting a piece of paper.
2. **Learners don't own their credentials.** If Coursera or a university portal dies, the
   records die with it. Academic history lives on someone else's server.
3. **University infra can't serve its own students.** FUTO/UNILAG/OAU portals crash on
   registration day — single-server model buckles exactly when it matters.
4. **Nigerian tutors can't get paid globally.** PayPal restricted, Wise won't issue
   routing numbers, Venmo unavailable, banks slow and lossy, platforms hold payouts 7–30 days.

**The moat:** institutional **student-ID verification** gates the whole platform. Without
it, this is just another NFT course marketplace (dozens exist). With it, it's anti-fraud
credential infrastructure — an employer trusts the blockchain, not the paper, the student,
or the platform.

---

## 2. Architecture Overview

```
                         ┌─────────────────────────────────────────────┐
                         │                  FRONTEND                    │
                         │  Next.js · TypeScript · Tailwind             │
                         │  Solana wallet-adapter (Phantom/Backpack)    │
                         │  Student portal · Instructor dash · Verifier │
                         └───────────────┬──────────────┬──────────────┘
                                         │ REST/WS      │ RPC (direct)
                                         ▼              ▼
        ┌────────────────────────────────────┐   ┌──────────────────────────────┐
        │            BACKEND (Go/Gin)         │   │        SOLANA (devnet)        │
        │  • Student-ID verification service  │   │  Anchor programs:             │
        │  • DID / VC issuance orchestration  │   │   - course (NFT/SFT mint)     │
        │  • Course metadata API              │   │   - buy + revenue split       │
        │  • WebSocket (live enroll/pay feed) │   │   - certificate issuance      │
        │  • Redis cache · Postgres store     │   │  Metaplex (royalties)         │
        └───────────┬─────────────┬───────────┘   └───────────────┬──────────────┘
                    │             │                                │
              ┌─────▼────┐  ┌─────▼─────┐                  ┌───────▼────────┐
              │ Postgres │  │   Redis   │                  │ IPFS · Arweave │
              │ off-chain│  │ cache +   │                  │ content · certs│
              │ metadata │  │ sessions  │                  │ + The Graph idx│
              └──────────┘  └───────────┘                  └────────────────┘
```

**Design principle — chain is source of truth, Postgres is a cache/index.** Enrollment,
ownership, and certificates live on-chain. If the Go backend dies, a student's enrollment
*still exists* because it's token ownership, not a DB row. Postgres holds searchable
metadata and a mirror; it is rebuildable from chain + The Graph.

---

## 3. Key Decision — Solana, not EVM

> **The source spec mixes two incompatible stacks.** It lists Wagmi + Viem + RainbowKit
> (Ethereum/EVM tooling) *and* Solana + Anchor + Metaplex + Phantom. Payments, royalties,
> contracts, and the 65k-TPS claim are all Solana. **We commit to Solana end-to-end** and
> drop the EVM wallet libs.

| Spec said      | We use                          | Why                                          |
|----------------|---------------------------------|----------------------------------------------|
| RainbowKit     | `@solana/wallet-adapter-react`  | RainbowKit is EVM-only                        |
| Wagmi + Viem   | `@solana/web3.js` + Anchor TS   | Wagmi is EVM-only                             |
| MetaMask       | Phantom / Backpack / Solflare   | Solana-native wallets                         |
| Solidity       | Anchor (Rust)                   | Already in the spec, cheap + fast            |

If an EVM target is ever required, it's a parallel contract layer — not v1.

---

## 4. Functional Requirements → Components

### 4.1 Identity & Auth (the moat)
- Pseudo-anonymous registration via **DID** — no PII on-chain.
- Student enters **matriculation number** → Go backend validates against the university
  registry (real API if available, else managed allowlist).
- On success: a **W3C Verifiable Credential** is issued and the student's Solana **wallet
  is cryptographically bound to their DID**.
- After binding, **wallet-connect is the only login** — the wallet *is* the verified identity.
- Roles: **Learner · Instructor · Admin.**

### 4.2 Course Management
- Instructors create/publish/manage courses.
- Tokenized as **NFT** (unique/limited — e.g. 50-seat masterclass) or **SFT** (scalable
  standard course, thousands of identical-but-owned copies).
- Enrollment enforced by smart contract — **own the token, access the course.** No admin.
- Content on **IPFS/Arweave**, with on-chain content-hash reference.

### 4.3 Credentials & Certification
- Smart contract issues certificate on-chain **only when completion condition fires**.
- Publicly verifiable by employers/institutions with no call to the issuer.
- Stored permanently on **Arweave**, tied to the student **DID** (portable, not
  platform-locked, W3C standard).

### 4.4 Transparency & Verification
- Course authenticity, full ownership history, and cert validity queryable on-chain by
  anyone, anytime — via **The Graph** for fast reads.

---

## 5. Payment Model (NFTs & SFTs)

> Think of it like a bookshop run by a robot nobody owns. Student buys → robot collects →
> tutor's cut lands the same second. That robot is the smart contract.

**Flow:**
1. Tutor deploys a course contract on Solana: price, tutor wallet, platform share (e.g. 90/10).
2. Course minted as NFT or SFT.
3. Student buys with SOL / SPL tokens.
4. Contract **splits payment in one transaction** — tutor wallet + platform wallet, atomically.
5. Course token transfers to student — it's simultaneously **receipt + access key + proof of ownership**.
6. Hold the token → keep access. No login, no subscription.

**Royalties:** tutor encodes e.g. 5% at mint (Metaplex standard). Every future resale,
forever, pays the tutor automatically — enforced whether they're online or not. Passive
income from secondary markets, a first for Nigerian course creators.

| Party          | When paid                      | How                                        |
|----------------|--------------------------------|--------------------------------------------|
| Tutor          | Instant, same tx as sale       | Contract splits to tutor wallet            |
| Platform       | Instant, same tx as sale       | Configurable % at contract level (~10%)    |
| Tutor (resale) | Every resale, forever          | Metaplex royalty encoded in token          |
| Student        | N/A (buyer)                    | Receives token as access key + ownership   |

**Why it matters for Nigerian tutors:** no Paystack/Flutterwave/bank, global students pay
directly, no 7–30 day payout hold, on-chain auditable income, royalty passive income.

---

## 6. Data Model

### 6.1 On-chain (source of truth)
- **DID Registry PDA** — `did → wallet` binding, VC hash, issued-at.
- **Course account** — instructor, mint, price, supply (NFT=1 / SFT=N), royalty bps,
  platform bps, content hash (IPFS CID), metadata URI.
- **Enrollment** — implicit: token balance in student wallet (no extra account).
- **Certificate account** — student DID, course, issued-at, Arweave tx id, completion proof.

### 6.2 Off-chain (Postgres — cache/index, rebuildable)
```
users         (did PK, wallet, role, matric_hash, reputation, created_at)
courses       (id PK, mint, instructor_did, title, desc, price_lamports,
               token_type, supply, royalty_bps, content_cid, metadata_uri, status)
enrollments   (id PK, course_id FK, student_did FK, token_signature, enrolled_at)  -- mirror of chain
certificates  (id PK, course_id FK, student_did FK, arweave_tx, issued_at)         -- mirror of chain
verifications (matric_hash PK, status, verified_at)  -- never store raw matric or PII
```
> **PII rule:** never persist raw matriculation numbers or names. Store a salted hash for
> idempotency only. Registry data never touches the chain.

### 6.3 Redis
- Hot course list, session nonces for wallet sign-in, rate-limit counters for the
  registration rush, verification challenge tokens.

---

## 7. Student Verification Flow

```
 Student        Frontend            Go Backend           Registry        Chain (DID reg)
   │               │                    │                   │                 │
   │ enter matric  │                    │                   │                 │
   ├──────────────►│  POST /verify      │                   │                 │
   │               ├───────────────────►│  lookup matric    │                 │
   │               │                    ├──────────────────►│                 │
   │               │                    │◄──── valid ───────┤                 │
   │               │                    │  issue VC + DID    │                 │
   │               │                    ├────────────────────────────────────►│ bind did→?
   │               │◄── challenge ──────┤  (await wallet)    │                 │
   │ connect wallet│                    │                   │                 │
   ├──────────────►│  sign challenge    │                   │                 │
   │               ├───────────────────►│  verify sig        │                 │
   │               │                    ├────────────────────────────────────►│ bind did→wallet
   │               │◄── session+role ───┤                   │                 │
   │ wallet = identity from now on      │                   │                 │
```

1. Student enters matric number in onboarding UI.
2. Go backend validates against registry (API **or** managed CSV/DB allowlist fallback).
3. On success, Veramo/Ceramic issues a W3C VC tied to a new DID.
4. Student connects Solana wallet (wallet-adapter).
5. Wallet is cryptographically bound to the verified DID on-chain.
6. All later logins = wallet connect only.

---

## 8. Non-Functional Requirements

| Factor           | Requirement & how we meet it                                              |
|------------------|---------------------------------------------------------------------------|
| Security         | Anchor + devnet-first + audit before mainnet; no PII on-chain             |
| Privacy          | Pseudo-anonymous by design; registry data never persisted on-chain        |
| Scalability      | Go goroutines absorb spikes; Solana ~65k TPS; SFTs scale mass enrollment   |
| Performance      | Redis hot cache; The Graph for on-chain reads; Next.js SSG static pages    |
| Availability     | IPFS/Arweave kills single-point-of-failure; chain survives backend death   |
| Interoperability | W3C DID; credentials portable across platforms/chains                     |
| Usability        | Matric entry = familiar onboarding; wallet-adapter abstracts wallet pain   |
| Trustlessness    | Enrollment/payment/cert rules all enforced by audited contracts           |

---

## 9. Tech Stack

**Frontend:** Next.js · TypeScript · Tailwind · `@solana/wallet-adapter-react` · `@solana/web3.js`
**Backend:** Go (Gin) · PostgreSQL · Redis · Node (only where a Web3 JS lib is unavoidable)
**Chain/Storage:** Solana + Anchor · Metaplex · Veramo/Ceramic (DID/VC) · IPFS+Filecoin · Arweave · The Graph
**DevOps:** GitHub Actions · Docker · Vercel (frontend) · Solana Devnet

---

## 10. Risks & Mitigations

| Risk                              | Mitigation                                              |
|-----------------------------------|---------------------------------------------------------|
| University has no registry API    | Managed CSV/DB allowlist now; API integration later     |
| Students unfamiliar with wallets  | wallet-adapter onboarding; matric entry as first step   |
| Smart-contract bugs               | Anchor; devnet-first; third-party audit before mainnet  |
| IPFS content unavailable          | Pin to multiple nodes + Filecoin deal                   |
| Regulatory risk in Nigeria        | Pseudo-anonymous; no fiat on-ramp in v1; pure SOL        |
| **Scope (hackathon)**             | **Demo the moat: verify → mint → buy+split → cert. Mock the rest.** |

---

## 11. Hackathon Scope — Real vs. Mocked

| Capability               | v1 (demo)                          | Later                        |
|--------------------------|------------------------------------|------------------------------|
| Student verification     | Managed allowlist (CSV)            | Live university registry API |
| DID / VC issuance        | Stubbed issuer, real binding shape | Full Veramo/Ceramic          |
| Course mint NFT/SFT      | Real on devnet                     | Mainnet + audit              |
| Buy + revenue split      | Real on devnet                     | Mainnet                      |
| Royalties                | Metaplex config at mint            | Secondary-market UI          |
| Certificate issuance     | Real on devnet, Arweave stub       | Full Arweave permanence      |
| Content storage          | IPFS (single pin)                  | Filecoin deals               |
| Indexing                 | Direct RPC                         | The Graph subgraph           |

**Demo golden path:** verify matric → bind wallet → instructor mints a course →
student buys (payment splits live) → student completes → cert issued on-chain → public
verifier confirms it in seconds.
