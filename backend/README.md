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
| GET    | `/api/v1/verify-cert/:did/:course`| public credential check (stub)        |

## Try the moat

```bash
curl -s localhost:8080/api/v1/verify \
  -H 'content-type: application/json' \
  -d '{"matric":"FUTO/2021/12345"}'
# {"verified":true,"did":"did:educhain:...","challenge":"educhain-bind:..."}
```

## What's stubbed

- `did.IssueVC` / `VerifySignature` — real Veramo/Ceramic + ed25519 verify pending.
- On-chain `bind_did` and cert lookup — wired once the Anchor program is deployed.
- Redis + Postgres — currently in-memory. See `todo.txt`.
