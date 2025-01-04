const Course = require("../models/courseModel");
const User = require("../models/userModel");

const coursesController = {
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find({}).populate("students", "name");
      res.status(200).json({ success: true, data: courses });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch courses",
        details: err.message,
      });
    }
  },

  async addCourse(req, res) {
    try {
      const { name, lecturer, credits, capacity } = req.body;
      if (!name || !lecturer || !credits || !capacity) {
        return res.status(400).json({
          success: false,
          error: "Please provide all required fields",
        });
      }
      const courseExists = await Course.findOne({ name });
      if (courseExists) {
        return res.status(400).json({
          success: false,
          error: "Course already exists",
        });
      }

      const course = new Course({
        name,
        lecturer,
        credits,
        capacity,
      });
      await course.save();
      res.status(201).json({ success: true, data: course });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          error: "Course already exists",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: err.message,
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to add course",
        details: err.message,
      });
    }
  },

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { name, lecturer, credits, capacity } = req.body;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid course ID",
        });
      }
      const courseExists = await Course.findOne({ name });
      if (courseExists) {
        return res.status(400).json({
          success: false,
          error: "Course name already exists",
        });
      }

      if (credits < 3 || credits > 5) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid credits" });
      }

      if (capacity < 1) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid capacity" });
      }
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { name, lecturer, credits, capacity },
        { new: true }
      );
      if (!updatedCourse) {
        return res
          .status(404)
          .json({ success: false, error: "Course not found" });
      }

      res.status(200).json({ success: true, data: updatedCourse });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to update course",
        details: err.message,
      });
    }
  },

  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const deletedCourse = await Course.findOneAndDelete({ _id: id });
      if (!deletedCourse) {
        return res
          .status(404)
          .json({ success: false, error: "Course not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Course deleted successfully" });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to delete course",
        details: err.message,
      });
    }
  },

  async getCourseStatus(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id).populate("students", "name");
      if (!course) {
        return res
          .status(404)
          .json({ success: false, error: "Course not found" });
      }
      const status = {
        courseName: course.name,
        courseCredits: course.credits,
        totalCapacity: course.capacity,
        remainingCapacity: course.capacity - course.students.length,
        students: course.students.map((student) => student.name),
      };
      res.status(200).json({ success: true, data: status });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch course status",
        details: err.message,
      });
    }
  },

  async enrollInCourse(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const user = await User.findById(userId).populate("refId");
      if (!user || user.role !== "Student") {
        return res.status(403).json({
          success: false,
          error: "Only students can enroll in courses",
        });
      }

      const student = user.refId;
      if (!student) {
        return res
          .status(404)
          .json({ success: false, error: "Student not found" });
      }

      const course = await Course.findById(id);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, error: "Course not found" });
      }

      if (course.students.length >= course.capacity) {
        return res
          .status(400)
          .json({ success: false, error: "Course is full" });
      }

      const totalCredits = student.total_credits || 0;
      if (totalCredits + course.credits > 20) {
        return res.status(400).json({
          success: false,
          error: "Cannot enroll: exceeding maximum credits",
        });
      }

      if (course.students.includes(student._id)) {
        return res
          .status(400)
          .json({ success: false, error: "Already enrolled in this course" });
      }

      course.students.push(student._id);
      student.courses.push(course._id);
      student.total_credits += course.credits;

      await Promise.all([course.save(), student.save()]);

      res.status(200).json({ success: true, message: "Enrolled successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to enroll in course",
        details: err.message,
      });
    }
  },

  async dropFromCourse(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const user = await User.findById(userId).populate("refId");
      if (!user || user.role !== "Student") {
        return res.status(403).json({
          success: false,
          error: "Only students can drop from courses",
        });
      }

      const student = user.refId;
      if (!student) {
        return res
          .status(404)
          .json({ success: false, error: "Student not found" });
      }

      const course = await Course.findById(id);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, error: "Course not found" });
      }

      if (!course.students.includes(student._id)) {
        return res.status(400).json({
          success: false,
          error: "You are not enrolled in this course",
        });
      }

      course.students = course.students.filter(
        (studentId) => !studentId.equals(student._id)
      );
      student.courses = student.courses.filter((id) => !id.equals(course._id));
      student.total_credits -= course.credits;

      await Promise.all([course.save(), student.save()]);

      res.status(200).json({
        success: true,
        message: "Dropped course successfully",
        course: {
          id: course._id,
          name: course.name,
          credits: course.credits,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to drop from course",
        details: err.message,
      });
    }
  },
};

module.exports = { coursesController };
