package httpapi

import (
	"net/http"

	"github.com/educhain/backend/internal/config"
	"github.com/educhain/backend/internal/course"
	"github.com/educhain/backend/internal/did"
	"github.com/educhain/backend/internal/student"
	"github.com/educhain/backend/internal/verify"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// New wires the router. All real logic lives in the service packages — this is just plumbing.
func New(cfg config.Config) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(cors.Default()) // wide open for the hackathon; lock down before mainnet
	r.SetTrustedProxies(nil)

	verifier := verify.NewService(cfg.RegistryCSV)
	issuer := did.NewIssuer()
	courses := course.NewService()
	students := student.NewService(courses, cfg.SolanaCluster)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	r.HEAD("/health", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	api := r.Group("/api/v1")
	{
		// the moat: matric -> verified -> DID + wallet binding
		api.POST("/verify", verifyHandler(verifier, issuer))
		api.POST("/bind", bindHandler(issuer))

		// course metadata mirror (chain stays source of truth)
		api.GET("/courses", listCoursesHandler(courses))
		api.POST("/courses", createCourseHandler(courses))
		api.GET("/courses/:id", getCourseHandler(courses))
		api.GET("/courses/:id/related", relatedCoursesHandler(courses))
		api.GET("/marketplace/courses", listMarketplaceCoursesHandler(courses))

		// student onboarding profile + selected course + mock SheerID proof
		api.POST("/students/onboard", onboardStudentHandler(students))
		api.GET("/students", listStudentsHandler(students))
		api.GET("/wallets/:wallet/student", getStudentByWalletHandler(students))
		api.GET("/students/:id", getStudentHandler(students))
		api.POST("/sheerid/verify", verifySheerIDHandler(students))

		// devnet-facing client config
		api.GET("/solana/config", solanaConfigHandler(cfg))

		// public credential check — the whole pitch in one endpoint
		api.GET("/verify-cert/:did/:course", verifyCertHandler(courses))
	}

	return r
}
