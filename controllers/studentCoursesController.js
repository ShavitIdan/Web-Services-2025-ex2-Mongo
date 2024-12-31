const Course = require("../models/course");

const studentCoursesController = {
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find({});
      res.json(courses).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async getMyCourses(req, res) {
    try {
      const { studentId } = req.params;
      const courses = await Course.find({ students: studentId });
      res.json(courses).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },
};
