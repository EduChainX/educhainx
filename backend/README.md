# EduChain Backend (Go + Gin)

The off-chain brain. Does three jobs: the **student-ID verification moat**, **DID/VC
issuance + wallet binding**, and a **searchable course catalog mirror**. Chain stays the
source of truth — this is a fast index in front of it.

## Run

```bash
go mod tidy
go run ./cmd/server
# -> educhain api up on :8080
```

## Env

| Var           | Default                          | Notes                              |
|---------------|----------------------------------|------------------------------------|
| `PORT`        | `8080`                           |                                    |
| `ENV`         | `dev`                            |                                    |
| `SOLANA_RPC`  | `https://api.devnet.solana.com`  | devnet for the hackathon           |
| `SOLANA_CLUSTER` | `devnet`                      | client-facing cluster label        |
| `SOLANA_PROGRAM_ID` | `Edu1111111111111111111111111111111111111111` | Anchor program id |
| `REGISTRY_CSV`| `internal/verify/registry.csv`   | managed allowlist (the fallback)   |
| `REDIS_URL`   | `redis://localhost:6379`         | not wired yet — see todo.txt       |

## Endpoints

| Method | Path                              | What                                  |
|--------|-----------------------------------|---------------------------------------|
| GET    | `/health`                         | liveness                              |
| POST   | `/api/v1/verify`                  | matric → `{verified, did, challenge}` |
| POST   | `/api/v1/bind`                    | prove wallet, bind wallet↔DID         |
| GET    | `/api/v1/courses`                 | list catalog                          |
| POST   | `/api/v1/courses`                 | index a freshly-minted course         |
| GET    | `/api/v1/courses/:id`             | one course                            |
| GET    | `/api/v1/courses/:id/related`     | related available courses             |
| GET    | `/api/v1/marketplace/courses`     | available marketplace courses         |
| POST   | `/api/v1/sheerid/verify`          | mock SheerID proof check              |
| POST   | `/api/v1/students/onboard`        | create/update student onboarding data |
| GET    | `/api/v1/students`                | seeded/onboarded students             |
| GET    | `/api/v1/students/:id`            | one student onboarding record         |
| GET    | `/api/v1/wallets/:wallet/student` | student record by wallet              |
| GET    | `/api/v1/solana/config`           | devnet RPC + program id               |
| GET    | `/api/v1/verify-cert/:did/:course`| public credential check (stub)        |

## Try the moat

```bash
curl -s localhost:8080/api/v1/verify \
  -H 'content-type: application/json' \
  -d '{"matric":"FUTO/2021/12345"}'
# {"verified":true,"did":"did:educhain:...","challenge":"educhain-bind:..."}
```

## Try student onboarding

```bash
curl -s localhost:8080/api/v1/students/onboard \
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
# -> {"student":{"selected_course":...,"verification":{"provider":"sheerid_mock","status":"verified"},...}}
```

## What's stubbed

- `did.IssueVC` / `VerifySignature` — real Veramo/Ceramic + ed25519 verify pending.
- `student.VerifySheerID` — deterministic mock provider. Replace this with a real SheerID API adapter.
- On-chain `bind_did` and cert lookup — wired once the Anchor program is deployed.
- Redis + Postgres — currently in-memory. See `todo.txt`.
