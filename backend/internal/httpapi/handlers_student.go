package httpapi

import (
	"errors"
	"net/http"
	"time"

	"github.com/educhain/backend/internal/student"
	"github.com/gin-gonic/gin"
)

func onboardStudentHandler(s *student.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req student.OnboardingInput
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		st, created, err := s.Onboard(req)
		if err != nil {
			if errors.Is(err, student.ErrCourseNotFound) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "selected course does not exist"})
				return
			}
			if errors.Is(err, student.ErrProofRejected) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "student proof was rejected"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not onboard student"})
			return
		}

		status := http.StatusCreated
		if !created {
			status = http.StatusOK
		}
		c.JSON(status, gin.H{"student": st})
	}
}

func listStudentsHandler(s *student.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"students": s.List()})
	}
}

func getStudentHandler(s *student.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		st, ok := s.Get(c.Param("id"))
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "no such student"})
			return
		}
		c.JSON(http.StatusOK, st)
	}
}

func getStudentByWalletHandler(s *student.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		st, ok := s.GetByWallet(c.Param("wallet"))
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "no such student"})
			return
		}
		c.JSON(http.StatusOK, st)
	}
}

func verifySheerIDHandler(s *student.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req student.SheerIDInput
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		rec := s.VerifySheerID(req, time.Now().UTC())
		status := http.StatusOK
		if rec.Status == student.StatusRejected {
			status = http.StatusUnauthorized
		}
		c.JSON(status, gin.H{"verification": rec})
	}
}
