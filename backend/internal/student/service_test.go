package student

import (
	"testing"
	"time"

	"github.com/educhain/backend/internal/course"
)

func TestOnboardCreatesVerifiedStudentWithSelectedCourse(t *testing.T) {
	courses := course.NewService()
	s := NewService(courses, "devnet")

	st, created, err := s.Onboard(OnboardingInput{
		Name:             "Chika Obi",
		AccountName:      "chika.obi",
		Email:            "chika@example.edu.ng",
		Matric:           "FUTO/2021/12346",
		DID:              "did:educhain:test-chika",
		Wallet:           "ChikaWallet111111111111111111111111111111111",
		SelectedCourseID: "c_2",
		SheerIDProof:     "sheerid-approved-chika",
	})
	if err != nil {
		t.Fatalf("onboard failed: %v", err)
	}
	if !created {
		t.Fatal("expected new student to be created")
	}
	if st.SelectedCourse == nil || st.SelectedCourse.ID != "c_2" {
		t.Fatalf("expected selected course c_2, got %#v", st.SelectedCourse)
	}
	if st.Verification.Status != StatusVerified {
		t.Fatalf("expected verified proof, got %s", st.Verification.Status)
	}
	if st.StudentHash == "" {
		t.Fatal("expected student hash commitment")
	}
}

func TestOnboardRejectsUnknownSelectedCourse(t *testing.T) {
	s := NewService(course.NewService(), "devnet")

	_, _, err := s.Onboard(OnboardingInput{
		Name:             "Missing Course",
		AccountName:      "missing.course",
		Matric:           "FUTO/2021/12346",
		SelectedCourseID: "missing",
		SheerIDProof:     "approved",
	})
	if err != ErrCourseNotFound {
		t.Fatalf("expected ErrCourseNotFound, got %v", err)
	}
}

func TestVerifySheerIDMockRejectsInvalidProof(t *testing.T) {
	s := NewService(course.NewService(), "devnet")

	rec := s.VerifySheerID(SheerIDInput{
		Matric:       "FUTO/2021/12346",
		SheerIDProof: "reject-this-proof",
	}, time.Now().UTC())
	if rec.Status != StatusRejected {
		t.Fatalf("expected rejected proof, got %s", rec.Status)
	}
	if rec.FailureReason == "" {
		t.Fatal("expected failure reason")
	}
}

func TestOnboardRejectsInvalidSheerIDProof(t *testing.T) {
	s := NewService(course.NewService(), "devnet")

	_, _, err := s.Onboard(OnboardingInput{
		Name:             "Rejected Proof",
		AccountName:      "rejected.proof",
		Matric:           "FUTO/2021/12346",
		SelectedCourseID: "c_1",
		SheerIDProof:     "invalid-proof",
	})
	if err != ErrProofRejected {
		t.Fatalf("expected ErrProofRejected, got %v", err)
	}
}
