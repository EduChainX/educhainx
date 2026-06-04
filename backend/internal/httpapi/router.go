package httpapi

import (
	"net/http"

	"github.com/educhain/backend/internal/config"
	"github.com/educhain/backend/internal/course"
	"github.com/educhain/backend/internal/did"
	"github.com/educhain/backend/internal/verify"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// New wires the router. All real logic lives in the service packages — this is just plumbing.
func New(cfg config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default()) // wide open for the hackathon; lock down before mainnet

	verifier := verify.NewService(cfg.RegistryCSV)
	issuer := did.NewIssuer()
	courses := course.NewService()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
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

		// public credential check — the whole pitch in one endpoint
		api.GET("/verify-cert/:did/:course", verifyCertHandler(courses))
	}

	return r
}
