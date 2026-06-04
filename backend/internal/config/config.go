package config

import "os"

// Config holds the knobs we read from env. Keep it flat — no nested structs till we need them.
type Config struct {
	Port        string
	Env         string
	SolanaRPC   string
	RegistryCSV string // path to the managed allowlist — our fallback until a real uni API exists
	RedisURL    string
}

func Load() Config {
	return Config{
		Port:        env("PORT", "8080"),
		Env:         env("ENV", "dev"),
		SolanaRPC:   env("SOLANA_RPC", "https://api.devnet.solana.com"),
		RegistryCSV: env("REGISTRY_CSV", "internal/verify/registry.csv"),
		RedisURL:    env("REDIS_URL", "redis://localhost:6379"),
	}
}

func env(k, fallback string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return fallback
}
