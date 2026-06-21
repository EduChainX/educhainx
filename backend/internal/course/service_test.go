package course

import "testing"

func TestNewServiceSeedsMarketplaceCourses(t *testing.T) {
	s := NewService()

	courses := s.ListAvailable()
	if len(courses) < 4 {
		t.Fatalf("expected seeded marketplace courses, got %d", len(courses))
	}
	if courses[0].ID != "c_1" {
		t.Fatalf("expected deterministic first id c_1, got %s", courses[0].ID)
	}
	if courses[0].AvailableSeats == 0 {
		t.Fatal("expected available seats to be calculated")
	}
}

func TestRelatedUsesSeededRelationships(t *testing.T) {
	s := NewService()

	related, ok := s.Related("c_1")
	if !ok {
		t.Fatal("expected c_1 to exist")
	}
	if len(related) == 0 {
		t.Fatal("expected related courses for c_1")
	}
	if related[0].ID == "c_1" {
		t.Fatal("related courses must not include the source course")
	}
}
