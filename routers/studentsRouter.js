const { Router } = require("express");
const { studentsController } = require("../controllers/studentsController");

const studentsRouter = new Router();

studentsRouter.get("/", studentsController.getAllStudents);
studentsRouter.post("/", studentsController.addStudent);

module.exports = { studentsRouter };
