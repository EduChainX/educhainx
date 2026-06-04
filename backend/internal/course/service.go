package course

import (
	"fmt"
	"sync"
)

// TokenType decides the on-chain mint shape: one-of-a-kind vs scalable-but-owned.
type TokenType string

const (
	NFT TokenType = "nft" // unique / limited seats — e.g. 50-seat masterclass
	SFT TokenType = "sft" // standard course, thousands of identical owned copies
)

type Course struct {
	ID            string    `json:"id"`
	Mint          string    `json:"mint"`           // on-chain mint address
	InstructorDID string    `json:"instructor_did"`
	Title         string    `json:"title" binding:"required"`
	Description   string    `json:"description"`
	PriceLamports uint64    `json:"price_lamports"`
	TokenType     TokenType `json:"token_type"`
	Supply        uint64    `json:"supply"`       // 1 for NFT, N for SFT
	RoyaltyBps    uint16    `json:"royalty_bps"`  // tutor's cut on resale, e.g. 500 = 5%
	PlatformBps   uint16    `json:"platform_bps"` // platform cut on sale, e.g. 1000 = 10%
	ContentCID    string    `json:"content_cid"`  // IPFS hash of the course material
}

// Service is an in-memory catalog mirror. Chain is source of truth; this is just a fast,
// searchable index. Swap the map for Postgres without touching handlers.
type Service struct {
	mu      sync.RWMutex
	courses map[string]Course
	seq     int
}

func NewService() *Service {
	return &Service{courses: map[string]Course{}}
}

func (s *Service) Create(c Course) Course {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.seq++
	c.ID = fmt.Sprintf("c_%d", s.seq)
	if c.TokenType == "" {
		c.TokenType = SFT
	}
	s.courses[c.ID] = c
	return c
}

func (s *Service) Get(id string) (Course, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	c, ok := s.courses[id]
	return c, ok
}

func (s *Service) List() []Course {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]Course, 0, len(s.courses))
	for _, c := range s.courses {
		out = append(out, c)
	}
	return out
}
