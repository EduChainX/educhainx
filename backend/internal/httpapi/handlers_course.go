package httpapi

import (
	"net/http"

	"github.com/educhain/backend/internal/course"
	"github.com/gin-gonic/gin"
)

func listCoursesHandler(s *course.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"courses": s.List()})
	}
}

func getCourseHandler(s *course.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		crs, ok := s.Get(c.Param("id"))
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"error": "no such course"})
			return
		}
		c.JSON(http.StatusOK, crs)
	}
}

// createCourseHandler stores metadata only. The actual mint happens client-side against
// the Anchor program; we just index it so the catalog is searchable.
func createCourseHandler(s *course.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		var crs course.Course
		if err := c.ShouldBindJSON(&crs); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		saved := s.Create(crs)
		c.JSON(http.StatusCreated, saved)
	}
}
