package httpapi

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/educhain/backend/internal/config"
)

func TestMarketplaceAndStudentOnboardingRoutes(t *testing.T) {
	router := New(config.Config{
		Env:           "test",
		SolanaRPC:     "https://api.devnet.solana.com",
		SolanaCluster: "devnet",
		ProgramID:     "Edu1111111111111111111111111111111111111111",
		RegistryCSV:   "../verify/registry.csv",
	})

	get := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/v1/marketplace/courses", nil)
	router.ServeHTTP(get, req)
	if get.Code != http.StatusOK {
		t.Fatalf("marketplace status = %d, body = %s", get.Code, get.Body.String())
	}

	var marketplace struct {
		Courses []struct {
			ID        string `json:"id"`
			Available bool   `json:"available"`
		} `json:"courses"`
	}
	if err := json.Unmarshal(get.Body.Bytes(), &marketplace); err != nil {
		t.Fatalf("decode marketplace: %v", err)
	}
	if len(marketplace.Courses) == 0 || marketplace.Courses[0].ID == "" {
		t.Fatalf("expected seeded marketplace courses, got %#v", marketplace.Courses)
	}

	payload := []byte(`{
		"name":"Chika Obi",
		"account_name":"chika.obi",
		"email":"chika@example.edu.ng",
		"matric":"FUTO/2021/12346",
		"did":"did:educhain:test-chika",
		"wallet":"ChikaWallet111111111111111111111111111111111",
		"selected_course_id":"c_2",
		"sheerid_proof":"sheerid-approved-test"
	}`)
	post := httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/students/onboard", bytes.NewReader(payload))
	req.Header.Set("content-type", "application/json")
	router.ServeHTTP(post, req)
	if post.Code != http.StatusCreated {
		t.Fatalf("onboard status = %d, body = %s", post.Code, post.Body.String())
	}

	var onboarding struct {
		Student struct {
			ID               string `json:"id"`
			SelectedCourseID string `json:"selected_course_id"`
			Verification     struct {
				Status string `json:"status"`
			} `json:"verification"`
		} `json:"student"`
	}
	if err := json.Unmarshal(post.Body.Bytes(), &onboarding); err != nil {
		t.Fatalf("decode onboarding: %v", err)
	}
	if onboarding.Student.SelectedCourseID != "c_2" {
		t.Fatalf("selected course = %s", onboarding.Student.SelectedCourseID)
	}
	if onboarding.Student.Verification.Status != "verified" {
		t.Fatalf("verification status = %s", onboarding.Student.Verification.Status)
	}

	wallet := httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodGet, "/api/v1/wallets/ChikaWallet111111111111111111111111111111111/student", nil)
	router.ServeHTTP(wallet, req)
	if wallet.Code != http.StatusOK {
		t.Fatalf("wallet lookup status = %d, body = %s", wallet.Code, wallet.Body.String())
	}
}

func TestSheerIDRouteRejectsInvalidProof(t *testing.T) {
	router := New(config.Config{
		Env:           "test",
		SolanaRPC:     "https://api.devnet.solana.com",
		SolanaCluster: "devnet",
		ProgramID:     "Edu1111111111111111111111111111111111111111",
		RegistryCSV:   "../verify/registry.csv",
	})

	payload := []byte(`{"matric":"FUTO/2021/12346","sheerid_proof":"invalid-proof"}`)
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/v1/sheerid/verify", bytes.NewReader(payload))
	req.Header.Set("content-type", "application/json")
	router.ServeHTTP(w, req)
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, body = %s", w.Code, w.Body.String())
	}
}
