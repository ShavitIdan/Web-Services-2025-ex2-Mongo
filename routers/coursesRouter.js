const { Router } = require("express");
const { coursesController } = require("../controllers/coursesController");
const { authenticateToken } = require("../middleware/authenticateToken");
const { authorizeRole } = require("../middleware/authorizeRole");

const coursesRouter = new Router();

coursesRouter.get("/", authenticateToken, coursesController.getAllCourses);
coursesRouter.post(
  "/",
  authenticateToken,
  authorizeRole("FacultyMember"),
  coursesController.addCourse
);
coursesRouter.put(
  "/:id",
  authenticateToken,
  authorizeRole("FacultyMember"),
  coursesController.updateCourse
);
coursesRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRole("FacultyMember"),
  coursesController.deleteCourse
);
coursesRouter.get(
  "/:id",
  authenticateToken,
  authorizeRole("FacultyMember"),
  coursesController.getCourseStatus
);
coursesRouter.post(
  "/enroll/:courseId",
  authenticateToken,
  authorizeRole("Student"),
  coursesController.enrollInCourse
);
coursesRouter.post(
  "/drop/:courseId",
  authenticateToken,
  authorizeRole("Student"),
  coursesController.dropFromCourse
);
module.exports = { coursesRouter };
