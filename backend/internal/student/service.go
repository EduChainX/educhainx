package student

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/educhain/backend/internal/course"
)

type VerificationProvider string

const (
	ProviderSheerIDMock VerificationProvider = "sheerid_mock"
)

type VerificationStatus string

const (
	StatusPending  VerificationStatus = "pending"
	StatusVerified VerificationStatus = "verified"
	StatusRejected VerificationStatus = "rejected"
)

var (
	ErrCourseNotFound  = errors.New("course not found")
	ErrStudentNotFound = errors.New("student not found")
	ErrProofRejected   = errors.New("student proof rejected")
)

type Student struct {
	ID               string             `json:"id"`
	Name             string             `json:"name"`
	AccountName      string             `json:"account_name"`
	Email            string             `json:"email,omitempty"`
	Matric           string             `json:"matric,omitempty"`
	DID              string             `json:"did,omitempty"`
	Wallet           string             `json:"wallet,omitempty"`
	SelectedCourseID string             `json:"selected_course_id"`
	SelectedCourse   *course.Course     `json:"selected_course,omitempty"`
	RelatedCourses   []course.Course    `json:"related_courses,omitempty"`
	Verification     VerificationRecord `json:"verification"`
	StudentHash      string             `json:"student_hash"`
	OnChainNetwork   string             `json:"on_chain_network"`
	OnChainStatus    string             `json:"on_chain_status"`
	CreatedAt        time.Time          `json:"created_at"`
	UpdatedAt        time.Time          `json:"updated_at"`
}

type VerificationRecord struct {
	Provider      VerificationProvider `json:"provider"`
	Status        VerificationStatus   `json:"status"`
	Reference     string               `json:"reference"`
	ProofHash     string               `json:"proof_hash"`
	CheckedAt     time.Time            `json:"checked_at"`
	FailureReason string               `json:"failure_reason,omitempty"`
}

type OnboardingInput struct {
	Name             string `json:"name" binding:"required"`
	AccountName      string `json:"account_name" binding:"required"`
	Email            string `json:"email"`
	Matric           string `json:"matric" binding:"required"`
	DID              string `json:"did"`
	Wallet           string `json:"wallet"`
	SelectedCourseID string `json:"selected_course_id" binding:"required"`
	SheerIDProof     string `json:"sheerid_proof" binding:"required"`
}

type SheerIDInput struct {
	Matric       string `json:"matric" binding:"required"`
	Email        string `json:"email"`
	SheerIDProof string `json:"sheerid_proof" binding:"required"`
}

type Service struct {
	mu       sync.RWMutex
	students map[string]Student
	byWallet map[string]string
	seq      int

	courses *course.Service
	network string
}

func NewService(courses *course.Service, network string) *Service {
	s := &Service{
		students: map[string]Student{},
		byWallet: map[string]string{},
		courses:  courses,
		network:  network,
	}
	s.seed()
	return s
}

func (s *Service) Onboard(input OnboardingInput) (Student, bool, error) {
	crs, ok := s.courses.Get(input.SelectedCourseID)
	if !ok {
		return Student{}, false, ErrCourseNotFound
	}

	now := time.Now().UTC()
	verification := s.VerifySheerID(SheerIDInput{
		Matric:       input.Matric,
		Email:        input.Email,
		SheerIDProof: input.SheerIDProof,
	}, now)
	if verification.Status != StatusVerified {
		return Student{}, false, ErrProofRejected
	}
	studentID := s.existingID(input)

	s.mu.Lock()
	defer s.mu.Unlock()

	var st Student
	created := false
	if studentID != "" {
		st = s.students[studentID]
	} else {
		created = true
		s.seq++
		st.ID = fmt.Sprintf("stu_%d", s.seq)
		st.CreatedAt = now
	}

	st.Name = strings.TrimSpace(input.Name)
	st.AccountName = strings.TrimSpace(input.AccountName)
	st.Email = strings.TrimSpace(input.Email)
	st.Matric = strings.ToUpper(strings.TrimSpace(input.Matric))
	st.DID = strings.TrimSpace(input.DID)
	st.Wallet = strings.TrimSpace(input.Wallet)
	st.SelectedCourseID = input.SelectedCourseID
	st.SelectedCourse = &crs
	st.RelatedCourses = relatedOrEmpty(s.courses, input.SelectedCourseID)
	st.Verification = verification
	st.StudentHash = hashStudent(st.Name, st.AccountName, st.Matric, st.SelectedCourseID, verification.ProofHash)
	st.OnChainNetwork = s.network
	st.OnChainStatus = "pending_devnet_tx"
	st.UpdatedAt = now

	s.students[st.ID] = st
	if st.Wallet != "" {
		s.byWallet[strings.ToLower(st.Wallet)] = st.ID
	}
	return st, created, nil
}

func (s *Service) Get(id string) (Student, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	st, ok := s.students[id]
	return st, ok
}

func (s *Service) GetByWallet(wallet string) (Student, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	id, ok := s.byWallet[strings.ToLower(strings.TrimSpace(wallet))]
	if !ok {
		return Student{}, false
	}
	st, ok := s.students[id]
	return st, ok
}

func (s *Service) List() []Student {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]Student, 0, len(s.students))
	for _, st := range s.students {
		out = append(out, st)
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].ID < out[j].ID
	})
	return out
}

func (s *Service) existingID(input OnboardingInput) string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	wallet := strings.ToLower(strings.TrimSpace(input.Wallet))
	if wallet != "" {
		if id, ok := s.byWallet[wallet]; ok {
			return id
		}
	}

	matric := strings.ToUpper(strings.TrimSpace(input.Matric))
	for id, st := range s.students {
		if st.Matric == matric {
			return id
		}
	}
	return ""
}

func (s *Service) VerifySheerID(input SheerIDInput, checkedAt time.Time) VerificationRecord {
	proof := strings.TrimSpace(input.SheerIDProof)
	reference := fmt.Sprintf("sheerid_mock_%s", hashShort(input.Matric+":"+input.Email+":"+proof))
	rec := VerificationRecord{
		Provider:  ProviderSheerIDMock,
		Reference: reference,
		ProofHash: hashFull(proof),
		CheckedAt: checkedAt,
	}

	if proof == "" {
		rec.Status = StatusRejected
		rec.FailureReason = "missing proof token"
		return rec
	}
	if strings.HasPrefix(strings.ToLower(proof), "reject") || strings.HasPrefix(strings.ToLower(proof), "invalid") {
		rec.Status = StatusRejected
		rec.FailureReason = "mock SheerID provider rejected proof token"
		return rec
	}

	rec.Status = StatusVerified
	return rec
}

func (s *Service) seed() {
	courses := s.courses.ListAvailable()
	if len(courses) == 0 {
		return
	}

	_, _, _ = s.Onboard(OnboardingInput{
		Name:             "Adaeze Nwosu",
		AccountName:      "adaeze.nwosu",
		Email:            "adaeze@example.edu.ng",
		Matric:           "FUTO/2021/12345",
		DID:              "did:educhain:seed-adaeze",
		Wallet:           "AdaezeDevnet11111111111111111111111111111111",
		SelectedCourseID: courses[0].ID,
		SheerIDProof:     "seed-sheerid-approved-adaeze",
	})
}

func relatedOrEmpty(courses *course.Service, id string) []course.Course {
	related, ok := courses.Related(id)
	if !ok {
		return []course.Course{}
	}
	return related
}

func hashStudent(name, accountName, matric, courseID, proofHash string) string {
	normalized := strings.Join([]string{
		strings.ToLower(strings.TrimSpace(name)),
		strings.ToLower(strings.TrimSpace(accountName)),
		strings.ToUpper(strings.TrimSpace(matric)),
		strings.TrimSpace(courseID),
		strings.TrimSpace(proofHash),
	}, "|")
	return hashFull(normalized)
}

func hashShort(value string) string {
	return hashFull(value)[:16]
}

func hashFull(value string) string {
	sum := sha256.Sum256([]byte(strings.TrimSpace(value)))
	return hex.EncodeToString(sum[:])
}
