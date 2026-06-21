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

## Infrastructure

### Backend

Run the Go API from the `backend/` folder:

```bash
cd backend
go run ./cmd/server
```

Default API base URL for the frontend:

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
```

Useful backend env vars:

| Var | Default | Notes |
|-----|---------|-------|
| `PORT` | `8080` | HTTP port |
| `SOLANA_CLUSTER` | `devnet` | Client-facing cluster label |
| `SOLANA_RPC` | `https://api.devnet.solana.com` | Solana RPC used by backend metadata |
| `SOLANA_PROGRAM_ID` | `Edu1111111111111111111111111111111111111111` | Anchor program id |
| `REGISTRY_CSV` | `internal/verify/registry.csv` | Mock student matric allowlist |

Verify the backend:

```bash
curl -s http://localhost:8080/health
go test ./...
```

### Frontend API Endpoints

All routes below are under `http://localhost:8080/api/v1`.

#### Student Identity

`POST /verify`

Checks a matric number against the mock registry and returns a DID challenge.

```bash
curl -s http://localhost:8080/api/v1/verify \
  -H 'content-type: application/json' \
  -d '{"matric":"FUTO/2021/12345"}'
```

Success:

```json
{
  "verified": true,
  "did": "did:educhain:...",
  "challenge": "educhain-bind:..."
}
```

`POST /bind`

Binds a verified DID to a Solana wallet after the frontend signs the challenge.

```json
{
  "did": "did:educhain:...",
  "wallet": "SolanaWalletPubkey",
  "signature": "base64-wallet-signature"
}
```

#### SheerID Proof

`POST /sheerid/verify`

Mock SheerID adapter for proof-of-student status. Any non-empty proof is accepted unless it starts with `reject` or `invalid`.

```bash
curl -s http://localhost:8080/api/v1/sheerid/verify \
  -H 'content-type: application/json' \
  -d '{"matric":"FUTO/2021/12345","email":"student@example.edu.ng","sheerid_proof":"sheerid-approved-demo"}'
```

Success:

```json
{
  "verification": {
    "provider": "sheerid_mock",
    "status": "verified",
    "reference": "sheerid_mock_...",
    "proof_hash": "...",
    "checked_at": "2026-06-21T..."
  }
}
```

#### Student Onboarding

`POST /students/onboard`

Creates or updates a student onboarding record with student name/account, selected course, wallet/DID, and SheerID proof. The backend stores the app profile; the Solana program stores only hashes and selected course pointers.

```bash
curl -s http://localhost:8080/api/v1/students/onboard \
  -H 'content-type: application/json' \
  -d '{
    "name":"Chika Obi",
    "account_name":"chika.obi",
    "email":"chika@example.edu.ng",
    "matric":"FUTO/2021/12346",
    "did":"did:educhain:demo-chika",
    "wallet":"ChikaDevnet111111111111111111111111111111111",
    "selected_course_id":"c_2",
    "sheerid_proof":"sheerid-approved-demo"
  }'
```

Response shape:

```json
{
  "student": {
    "id": "stu_2",
    "name": "Chika Obi",
    "account_name": "chika.obi",
    "selected_course_id": "c_2",
    "selected_course": {},
    "related_courses": [],
    "verification": { "provider": "sheerid_mock", "status": "verified" },
    "student_hash": "...",
    "on_chain_network": "devnet",
    "on_chain_status": "pending_devnet_tx"
  }
}
```

Student lookup:

```bash
curl -s http://localhost:8080/api/v1/students
curl -s http://localhost:8080/api/v1/students/stu_1
curl -s http://localhost:8080/api/v1/wallets/<wallet>/student
```

#### Marketplace Courses

`GET /marketplace/courses`

Returns seeded and indexed courses currently available in the marketplace.

```bash
curl -s http://localhost:8080/api/v1/marketplace/courses
```

`GET /courses`

Returns all indexed courses.

`GET /courses/:id`

Returns one course by id.

`GET /courses/:id/related`

Returns related available courses for the selected course.

`POST /courses`

Indexes course metadata after the instructor flow creates/mints the course on-chain.

```json
{
  "title": "Solana Program Architecture",
  "description": "Build Anchor programs with PDAs and safe payment flows.",
  "instructor_did": "did:educhain:instructor-adebayo",
  "instructor_name": "Dr. Tunde Adebayo",
  "category": "Blockchain",
  "level": "Intermediate",
  "tags": ["solana", "anchor", "rust"],
  "price_lamports": 1250000000,
  "token_type": "sft",
  "supply": 500,
  "royalty_bps": 500,
  "platform_bps": 1000,
  "content_cid": "bafy..."
}
```

#### Solana Config

`GET /solana/config`

Frontend can use this to display the active network and program id.

```json
{
  "cluster": "devnet",
  "rpc": "https://api.devnet.solana.com",
  "program_id": "Edu1111111111111111111111111111111111111111"
}
```

#### Certificate Verification

`GET /verify-cert/:did/:course`

Public credential check route. This is still a stub until certificate PDA lookup is wired to RPC.

```bash
curl -s "http://localhost:8080/api/v1/verify-cert/did%3Aeduchain%3Ademo/c_1"
```

### Smart Contracts

The Solana program lives in `contracts/programs/educhain`. It currently defines:

| Instruction | Purpose |
|-------------|---------|
| `bind_did` | Bind verified DID hash to a student wallet |
| `onboard_student` | Store hashed student onboarding proof and selected course pointer |
| `create_course` | Publish course economics and content hash |
| `buy_course` | Split SOL between instructor and platform |
| `issue_certificate` | Create a certificate PDA after completion |

Install prerequisites first: Rust/Cargo, Solana CLI, and Anchor CLI.

Local build/test:

```bash
cd contracts
anchor build
anchor test
```

Devnet deploy flow:

```bash
cd contracts
solana config set --url devnet
solana address
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet
```

After deploying, copy the deployed program id into both places:

```text
contracts/Anchor.toml
contracts/programs/educhain/src/lib.rs
```

Then restart the backend with:

```bash
SOLANA_CLUSTER=devnet \
SOLANA_RPC=https://api.devnet.solana.com \
SOLANA_PROGRAM_ID=<deployed-program-id> \
go run ./cmd/server
```
