package httpapi

import (
	"net/http"

	"github.com/educhain/backend/internal/course"
	"github.com/educhain/backend/internal/did"
	"github.com/educhain/backend/internal/verify"
	"github.com/gin-gonic/gin"
)

type verifyReq struct {
	Matric string `json:"matric" binding:"required"`
}

// verifyHandler is step 1 of the moat. Validate matric, mint a pending DID + VC.
// We never echo PII back — only the DID and status.
func verifyHandler(v *verify.Service, issuer *did.Issuer) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req verifyReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "matric required"})
			return
		}

		ok, err := v.Check(req.Matric)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "registry unreachable"})
			return
		}
		if !ok {
			// don't leak whether the matric exists — same response either way in v2
			c.JSON(http.StatusUnauthorized, gin.H{"verified": false})
			return
		}

		vc := issuer.IssueVC(req.Matric) // stubbed Veramo/Ceramic for now
		c.JSON(http.StatusOK, gin.H{
			"verified":  true,
			"did":       vc.DID,
			"challenge": vc.Challenge, // sign this with the wallet to bind
		})
	}
}

type bindReq struct {
	DID       string `json:"did" binding:"required"`
	Wallet    string `json:"wallet" binding:"required"`
	Signature string `json:"signature" binding:"required"`
}

// bindHandler is step 2: prove wallet ownership, then bind wallet<->DID on-chain.
func bindHandler(issuer *did.Issuer) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req bindReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "did, wallet, signature required"})
			return
		}

		if !issuer.VerifySignature(req.DID, req.Wallet, req.Signature) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "bad signature"})
			return
		}

		// TODO: fire the on-chain bind_did instruction here once the program is deployed
		c.JSON(http.StatusOK, gin.H{"bound": true, "did": req.DID, "wallet": req.Wallet})
	}
}

func verifyCertHandler(_ *course.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: read the certificate PDA from chain for (did, course) and report validity
		c.JSON(http.StatusOK, gin.H{
			"did":    c.Param("did"),
			"course": c.Param("course"),
			"valid":  false,
			"note":   "stub — wire to on-chain cert lookup",
		})
	}
}
