package main

import (
	"log"

	"github.com/educhain/backend/internal/config"
	"github.com/educhain/backend/internal/httpapi"
)

func main() {
	cfg := config.Load()

	srv := httpapi.New(cfg)

	log.Printf("educhain api up on :%s (env=%s)", cfg.Port, cfg.Env)
	if err := srv.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server fell over: %v", err)
	}
}
