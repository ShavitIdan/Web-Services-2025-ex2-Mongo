const { Router } = require("express");
const { coursesController } = require("../controllers/coursesController");

const coursesRouter = new Router();

coursesRouter.get("/", coursesController.getAllCourses);
coursesRouter.post("/", coursesController.addCourse);
coursesRouter.delete("/:id", coursesController.deleteCourse);

module.exports = { coursesRouter };
