package httpapi

import (
	"net/http"

	"github.com/educhain/backend/internal/config"
	"github.com/gin-gonic/gin"
)

func solanaConfigHandler(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"cluster":    cfg.SolanaCluster,
			"rpc":        cfg.SolanaRPC,
			"program_id": cfg.ProgramID,
		})
	}
}
