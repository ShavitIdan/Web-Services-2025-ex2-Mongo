const { Router } = require("express");
const { studentsController } = require("../controllers/studentsController");
const { authenticateToken } = require("../middleware/authenticateToken");
const { authorizeRole } = require("../middleware/authorizeRole");

const studentsRouter = new Router();

studentsRouter.get(
  "/",
  authenticateToken,
  authorizeRole("student"),
  studentsController.getAllStudents
);
studentsRouter.post(
  "/",
  authenticateToken,
  authorizeRole("student"),
  studentsController.addStudent
);
studentsRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRole("student"),
  studentsController.deleteStudent
);

module.exports = { studentsRouter };
