package course

import (
	"fmt"
	"sort"
	"sync"
)

// TokenType decides the on-chain mint shape: one-of-a-kind vs scalable-but-owned.
type TokenType string

const (
	NFT TokenType = "nft" // unique / limited seats — e.g. 50-seat masterclass
	SFT TokenType = "sft" // standard course, thousands of identical owned copies
)

type Course struct {
	ID               string    `json:"id"`
	Mint             string    `json:"mint"` // on-chain mint address
	InstructorDID    string    `json:"instructor_did"`
	InstructorName   string    `json:"instructor_name"`
	Title            string    `json:"title" binding:"required"`
	Description      string    `json:"description"`
	Category         string    `json:"category"`
	Level            string    `json:"level"`
	Tags             []string  `json:"tags"`
	PriceLamports    uint64    `json:"price_lamports"`
	TokenType        TokenType `json:"token_type"`
	Supply           uint64    `json:"supply"` // 1 for NFT, N for SFT
	Sold             uint64    `json:"sold"`   // indexed mirror of on-chain purchases
	AvailableSeats   uint64    `json:"available_seats"`
	RoyaltyBps       uint16    `json:"royalty_bps"`  // tutor's cut on resale, e.g. 500 = 5%
	PlatformBps      uint16    `json:"platform_bps"` // platform cut on sale, e.g. 1000 = 10%
	ContentCID       string    `json:"content_cid"`  // IPFS hash of the course material
	ImageURL         string    `json:"image_url"`
	Rating           float64   `json:"rating"`
	LearnerCount     uint64    `json:"learner_count"`
	Available        bool      `json:"available"`
	RelatedCourseIDs []string  `json:"related_course_ids"`
}

// Service is an in-memory catalog mirror. Chain is source of truth; this is just a fast,
// searchable index. Swap the map for Postgres without touching handlers.
type Service struct {
	mu      sync.RWMutex
	courses map[string]Course
	seq     int
}

func NewService() *Service {
	s := &Service{courses: map[string]Course{}}
	s.seed()
	return s
}

func (s *Service) Create(c Course) Course {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.createLocked(c)
}

func (s *Service) createLocked(c Course) Course {
	s.seq++
	c.ID = fmt.Sprintf("c_%d", s.seq)
	if c.TokenType == "" {
		c.TokenType = SFT
	}
	if c.Supply == 0 {
		c.Supply = 1
	}
	if c.AvailableSeats == 0 && c.Supply >= c.Sold {
		c.AvailableSeats = c.Supply - c.Sold
	}
	c.Available = c.AvailableSeats > 0
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
	sortCourses(out)
	return out
}

func (s *Service) ListAvailable() []Course {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]Course, 0, len(s.courses))
	for _, c := range s.courses {
		if c.Available {
			out = append(out, c)
		}
	}
	sortCourses(out)
	return out
}

func (s *Service) Related(id string) ([]Course, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	c, ok := s.courses[id]
	if !ok {
		return nil, false
	}

	seen := map[string]bool{id: true}
	out := make([]Course, 0, len(c.RelatedCourseIDs))
	for _, relID := range c.RelatedCourseIDs {
		rel, ok := s.courses[relID]
		if ok && rel.Available && !seen[rel.ID] {
			out = append(out, rel)
			seen[rel.ID] = true
		}
	}

	if len(out) < 3 {
		for _, rel := range s.courses {
			if seen[rel.ID] || !rel.Available {
				continue
			}
			if rel.Category == c.Category || overlaps(rel.Tags, c.Tags) {
				out = append(out, rel)
				seen[rel.ID] = true
			}
			if len(out) == 3 {
				break
			}
		}
	}

	sortCourses(out)
	return out, true
}

func (s *Service) seed() {
	s.mu.Lock()
	defer s.mu.Unlock()

	c1 := s.createLocked(Course{
		Mint:           "EduCourseDevnet111111111111111111111111111111",
		InstructorDID:  "did:educhain:instructor-adebayo",
		InstructorName: "Dr. Tunde Adebayo",
		Title:          "Solana Program Architecture",
		Description:    "Build Anchor programs with PDAs, account constraints, and safe payment flows.",
		Category:       "Blockchain",
		Level:          "Intermediate",
		Tags:           []string{"solana", "anchor", "rust"},
		PriceLamports:  1_250_000_000,
		TokenType:      SFT,
		Supply:         500,
		Sold:           38,
		RoyaltyBps:     500,
		PlatformBps:    1000,
		ContentCID:     "bafybeifuto-solana-program-architecture",
		ImageURL:       "https://images.unsplash.com/photo-1639762681057-408e52192e55",
		Rating:         4.9,
		LearnerCount:   238,
	})
	c2 := s.createLocked(Course{
		Mint:           "EduCourseDevnet222222222222222222222222222222",
		InstructorDID:  "did:educhain:instructor-okonkwo",
		InstructorName: "Prof. Nneka Okonkwo",
		Title:          "Decentralized Identity for Universities",
		Description:    "Design DID, verifiable credential, and wallet-binding flows for academic systems.",
		Category:       "Identity",
		Level:          "Advanced",
		Tags:           []string{"did", "credentials", "wallets"},
		PriceLamports:  900_000_000,
		TokenType:      NFT,
		Supply:         50,
		Sold:           12,
		RoyaltyBps:     700,
		PlatformBps:    1000,
		ContentCID:     "bafybeiunilag-decentralized-identity",
		ImageURL:       "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
		Rating:         4.8,
		LearnerCount:   91,
	})
	c3 := s.createLocked(Course{
		Mint:           "EduCourseDevnet333333333333333333333333333333",
		InstructorDID:  "did:educhain:instructor-salami",
		InstructorName: "Aisha Salami",
		Title:          "Smart Contract Security Lab",
		Description:    "Practice exploit analysis, invariant thinking, and defensive review for on-chain code.",
		Category:       "Security",
		Level:          "Advanced",
		Tags:           []string{"security", "rust", "audit"},
		PriceLamports:  1_800_000_000,
		TokenType:      SFT,
		Supply:         250,
		Sold:           44,
		RoyaltyBps:     650,
		PlatformBps:    1000,
		ContentCID:     "bafybeioau-smart-contract-security",
		ImageURL:       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
		Rating:         4.95,
		LearnerCount:   184,
	})
	c4 := s.createLocked(Course{
		Mint:           "EduCourseDevnet444444444444444444444444444444",
		InstructorDID:  "did:educhain:instructor-eze",
		InstructorName: "Chinedu Eze",
		Title:          "Web3 Product Engineering",
		Description:    "Ship usable marketplace, wallet, and credential UX around blockchain primitives.",
		Category:       "Product",
		Level:          "Beginner",
		Tags:           []string{"web3", "frontend", "marketplace"},
		PriceLamports:  650_000_000,
		TokenType:      SFT,
		Supply:         800,
		Sold:           203,
		RoyaltyBps:     400,
		PlatformBps:    1000,
		ContentCID:     "bafybeifuto-web3-product-engineering",
		ImageURL:       "https://images.unsplash.com/photo-1551434678-e076c223a692",
		Rating:         4.7,
		LearnerCount:   512,
	})

	c1.RelatedCourseIDs = []string{c3.ID, c4.ID}
	c2.RelatedCourseIDs = []string{c1.ID, c4.ID}
	c3.RelatedCourseIDs = []string{c1.ID, c2.ID}
	c4.RelatedCourseIDs = []string{c1.ID, c2.ID}
	s.courses[c1.ID] = c1
	s.courses[c2.ID] = c2
	s.courses[c3.ID] = c3
	s.courses[c4.ID] = c4
}

func sortCourses(courses []Course) {
	sort.Slice(courses, func(i, j int) bool {
		return courses[i].ID < courses[j].ID
	})
}

func overlaps(a, b []string) bool {
	seen := map[string]bool{}
	for _, tag := range a {
		seen[tag] = true
	}
	for _, tag := range b {
		if seen[tag] {
			return true
		}
	}
	return false
}
