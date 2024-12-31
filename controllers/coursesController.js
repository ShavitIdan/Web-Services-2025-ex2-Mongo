const Course = require("../models/courseModel");

const coursesController = {
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find({}).populate("students", "name");
      res.json(courses).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async addCourse(req, res) {
    try {
      const { id, name, lecturer, credits, capacity } = req.body;
      if (!id || !name || !lecturer || !credits || !capacity) {
        res.json({ error: "Please provide all required fields" }).status(400);
        return;
      }
      const course = new Course({
        id,
        name,
        lecturer,
        credits,
        capacity,
      });
      await course.save();
      res.json(course).status(201);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { name, lecturer, credits, capacity } = req.body;
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { name, lecturer, credits, capacity },
        { new: true }
      );
      if (!updatedCourse) {
        res.json({ error: "Course not found" }).status(404);
        return;
      }
      res.json(updatedCourse).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const deletedCourse = await Course.findByIdAndDelete(id);
      if (!deletedCourse) {
        res.json({ error: "Course not found" }).status(404);
        return;
      }
      res.json("Course deleted successfully").status(200);
    } catch (err) {
      res.json({ error: "Failed to delete course" }).status(500);
    }
  },
};

module.exports = { coursesController };
