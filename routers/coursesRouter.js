const { Router } = require("express");
const { coursesController } = require("../controllers/coursesController");
const { authenticateToken } = require("../middleware/authenticateToken");
const { authorizeRole } = require("../middleware/authorizeRole");

const coursesRouter = new Router();

coursesRouter.get("/", authenticateToken, coursesController.getAllCourses);
coursesRouter.post(
  "/",
  authenticateToken,
  authorizeRole("faculty"),
  coursesController.addCourse
);
coursesRouter.put(
  "/:id",
  authenticateToken,
  authorizeRole("faculty"),
  coursesController.updateCourse
);
coursesRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRole("faculty"),
  coursesController.deleteCourse
);

module.exports = { coursesRouter };
