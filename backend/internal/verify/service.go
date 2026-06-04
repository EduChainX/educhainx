package verify

import (
	"crypto/sha256"
	"encoding/csv"
	"encoding/hex"
	"os"
	"strings"
	"sync"
)

// Service is the moat. Right now it checks a managed allowlist CSV because no Nigerian
// university hands out a registry API. Swap Check() for a real HTTP call later — the
// interface to the rest of the app doesn't change.
type Service struct {
	csvPath string

	mu      sync.RWMutex
	allow   map[string]bool // sha256(matric) -> true, so we never hold raw matric in memory
	loaded  bool
}

func NewService(csvPath string) *Service {
	return &Service{csvPath: csvPath, allow: map[string]bool{}}
}

// Check returns whether this matric belongs to a real enrolled student.
func (s *Service) Check(matric string) (bool, error) {
	if err := s.ensureLoaded(); err != nil {
		return false, err
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.allow[hashMatric(matric)], nil
}

func (s *Service) ensureLoaded() error {
	s.mu.RLock()
	if s.loaded {
		s.mu.RUnlock()
		return nil
	}
	s.mu.RUnlock()

	s.mu.Lock()
	defer s.mu.Unlock()
	if s.loaded { // someone beat us to it
		return nil
	}

	f, err := os.Open(s.csvPath)
	if err != nil {
		return err
	}
	defer f.Close()

	rows, err := csv.NewReader(f).ReadAll()
	if err != nil {
		return err
	}
	for _, row := range rows {
		if len(row) == 0 {
			continue
		}
		matric := strings.TrimSpace(row[0])
		if matric == "" || strings.EqualFold(matric, "matric") { // skip header
			continue
		}
		s.allow[hashMatric(matric)] = true
	}
	s.loaded = true
	return nil
}

// hashMatric keeps PII out of memory and logs. Salt it properly before mainnet.
func hashMatric(m string) string {
	sum := sha256.Sum256([]byte(strings.ToUpper(strings.TrimSpace(m))))
	return hex.EncodeToString(sum[:])
}
