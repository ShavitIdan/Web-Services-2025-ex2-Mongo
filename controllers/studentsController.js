const Student = require("../models/studentModel");

const studentsController = {
  async addStudent(data) {
    try {
      const { name, address, academic_year } = data;

      if (!address || !name || !academic_year) {
        throw new Error("Please provide all required fields");
      }

      const student = new Student({
        name,
        address,
        academic_year,
      });
      await student.save();
      return student;
    } catch (err) {
      console.error("Failed to add student:", err.message);
      throw new Error("Failed to add student: " + err.message);
    }
  },
};

module.exports = { studentsController };
