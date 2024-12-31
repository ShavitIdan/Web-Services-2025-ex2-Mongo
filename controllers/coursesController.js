const Course = require("../models/courseModel");
const User = require("../models/userModel");
const Student = require("../models/studentModel");

const coursesController = {
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find({}).populate("students", "name");
      return res.json(courses).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async addCourse(req, res) {
    try {
      const { id, name, lecturer, credits, capacity } = req.body;
      if (!id || !name || !lecturer || !credits || !capacity) {
        return res
          .json({ error: "Please provide all required fields" })
          .status(400);
      }
      const course = new Course({
        id,
        name,
        lecturer,
        credits,
        capacity,
      });
      await course.save();
      return res.json(course).status(201);
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
        return res.json({ error: "Course not found" }).status(404);
      }
      return res.json(updatedCourse).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const deletedCourse = await Course.findByIdAndDelete(id);
      if (!deletedCourse) {
        return res.json({ error: "Course not found" }).status(404);
      }
      return res.json("Course deleted successfully").status(200);
    } catch (err) {
      res.json({ error: "Failed to delete course" }).status(500);
    }
  },

  async getCourseStatus(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id).populate("students", "name");
      if (!course) {
        return res.json({ error: "Course not found" }).status(404);
      }
      const status = {
        courseName: course.name,
        courseCredits: course.credits,
        totalCapacity: course.capacity,
        remainingCapacity: course.capacity - course.students.length,
        students: course.students.map((student) => student.name),
      };
      return res.json(status).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },
  async enrollInCourse(req, res) {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;

      const user = await User.findById(userId).populate("refId");
      if (!user || user.role !== "Student") {
        return res
          .status(403)
          .json({ error: "Only students can enroll in courses" });
      }

      const student = user.refId;
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      if (course.students.length >= course.capacity) {
        return res.status(400).json({ error: "Course is full" });
      }

      const totalCredits = student.total_credits || 0;
      if (totalCredits + course.credits > 20) {
        return res
          .status(400)
          .json({ error: "Cannot enroll: exceeding maximum credits" });
      }

      if (course.students.includes(student._id)) {
        return res
          .status(400)
          .json({ error: "Already enrolled in this course" });
      }

      course.students.push(student._id);
      student.courses.push(course._id);
      student.total_credits += course.credits;

      await Promise.all([course.save(), student.save()]);

      res.status(200).json({
        message: "Enrolled successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to enroll in course", details: error.message });
    }
  },
};

module.exports = { coursesController };
