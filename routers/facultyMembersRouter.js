const { Router } = require("express");
const {
  facultyMembersController,
} = require("../controllers/facultyMembersController");

const facultyMembersRouter = new Router();

facultyMembersRouter.get("/", facultyMembersController.getAllFacultyMembers);
facultyMembersRouter.post("/", facultyMembersController.addFacultyMember);
facultyMembersRouter.delete(
  "/:id",
  facultyMembersController.deleteFacultyMember
);

module.exports = { facultyMembersRouter };
