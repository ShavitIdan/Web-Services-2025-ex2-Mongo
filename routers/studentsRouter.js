const { Router } = require("express");
const { studentsController } = require("../controllers/studentsController");
const { authenticateToken } = require("../middleware/authenticateToken");
const { authorizeRole } = require("../middleware/authorizeRole");

const studentsRouter = new Router();

studentsRouter.get(
  "/",
  authenticateToken,
  authorizeRole("Student"),
  studentsController.getAllStudents
);
studentsRouter.post(
  "/",
  authenticateToken,
  authorizeRole("Student"),
  studentsController.addStudent
);
studentsRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRole("Student"),
  studentsController.deleteStudent
);

module.exports = { studentsRouter };
