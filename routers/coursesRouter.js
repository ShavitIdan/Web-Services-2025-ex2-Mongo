const { Router } = require("express");
const { coursesController } = require("../controllers/coursesController");
const { authenticateToken } = require("../middleware/authenticateToken");
const { authorizeRole } = require("../middleware/authorizeRole");

const coursesRouter = new Router();

coursesRouter.get("/", authenticateToken, coursesController.getAllCourses);
coursesRouter.get(
  "/:id",
  authenticateToken,
  authorizeRole("FacultyMember"),
  coursesController.getCourseStatus
);
coursesRouter.post(
  "/:id",
  authenticateToken,
  authorizeRole("Student"),
  coursesController.enrollInCourse
);
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

coursesRouter.delete(
  "/drop/:id",
  authenticateToken,
  authorizeRole("Student"),
  coursesController.dropFromCourse
);
module.exports = { coursesRouter };
