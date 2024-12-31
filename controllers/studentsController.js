const Student = require("../models/studentModel");

const studentsController = {
  async getAllStudents(req, res) {
    try {
      const students = await Student.find({});
      res.json(students).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async addStudent(req, res) {
    try {
      const { id, name, address, academic_year } = req.body;
      if (!id || !name || !academic_year) {
        res.json({ error: "Please provide all required fields" }).status(400);
        return;
      }
      const student = new Student({
        id,
        name,
        address,
        academic_year,
      });
      await student.save();
      res.json(student).status(201);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },
};

module.exports = { studentsController };
