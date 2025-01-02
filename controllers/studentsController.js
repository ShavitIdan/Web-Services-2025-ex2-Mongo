const Student = require("../models/studentModel");

const studentsController = {
  async getAllStudents(req, res) {
    try {
      const students = await Student.find({});
      res.status(200).json({ success: true, data: students });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch students",
        details: err.message,
      });
    }
  },

  async addStudent(req, res) {
    try {
      const { name, address, academic_year } = req.body;
      if (!address || !name || !academic_year) {
        return res.status(400).json({
          success: false,
          error: "Please provide all required fields",
        });
        return;
      }
      const student = new Student({
        name,
        address,
        academic_year,
      });
      await student.save();
      res.status(201).json({ success: true, data: student });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to add student",
        details: err.message,
      });
    }
  },

  async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) {
        return res
          .status(404)
          .json({ success: false, error: "Student not found" });
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "Student deleted successfully" });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          error: "Failed to delete student",
          details: err.message,
        });
    }
  },
};

module.exports = { studentsController };
