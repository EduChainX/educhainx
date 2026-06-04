package did

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

// Issuer stands in for Veramo/Ceramic. The shapes are real (DID + VC + challenge), the
// crypto is stubbed. Replace IssueVC/VerifySignature with real W3C issuance + ed25519
// verification against the Solana pubkey — the callers won't change.
type Issuer struct{}

type VerifiableCredential struct {
	DID       string
	Challenge string // student signs this with their wallet to prove ownership before binding
}

func NewIssuer() *Issuer { return &Issuer{} }

// IssueVC mints a pseudo-anonymous DID derived from the matric hash. No PII leaks into the DID.
func (i *Issuer) IssueVC(matric string) VerifiableCredential {
	sum := sha256.Sum256([]byte(matric))
	id := hex.EncodeToString(sum[:16])
	return VerifiableCredential{
		DID:       fmt.Sprintf("did:educhain:%s", id),
		Challenge: fmt.Sprintf("educhain-bind:%s", id), // TODO: random nonce, store in Redis w/ TTL
	}
}

// VerifySignature must verify the wallet signed the challenge (ed25519 over the Solana key).
// Stubbed true for the demo so the flow is walkable end-to-end.
func (i *Issuer) VerifySignature(did, wallet, signature string) bool {
	_ = did
	_ = wallet
	_ = signature
	return true // FIXME: real ed25519 verify before this touches anything that matters
}
