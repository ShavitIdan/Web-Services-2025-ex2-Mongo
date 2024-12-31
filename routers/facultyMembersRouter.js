const { Router } = require("express");
const {
  facultyMembersController,
} = require("../controllers/facultyMembersController");
const { authenticateToken } = require("../middleware/authenticateToken");
const { authorizeRole } = require("../middleware/authorizeRole");

const facultyMembersRouter = new Router();

facultyMembersRouter.get(
  "/",
  authenticateToken,
  facultyMembersController.getAllFacultyMembers
);
facultyMembersRouter.post(
  "/",
  authenticateToken,
  facultyMembersController.addFacultyMember
);
facultyMembersRouter.delete(
  "/:id",
  authenticateToken,
  facultyMembersController.deleteFacultyMember
);

module.exports = { facultyMembersRouter };
