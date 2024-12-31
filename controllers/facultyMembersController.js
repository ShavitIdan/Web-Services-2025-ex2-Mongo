const FacultyMember = require("../models/facultyMemberModel");

const facultyMembersController = {
  async getAllFacultyMembers(req, res) {
    try {
      const facultyMembers = await FacultyMember.find({});
      res.json(facultyMembers).status(200);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async addFacultyMember(req, res) {
    try {
      const { id, name, address } = req.body;
      if (!id || !name || !address) {
        res.json({ error: "Please provide all required fields" }).status(400);
        return;
      }
      const facultyMember = new FacultyMember({ id, name, address });
      await facultyMember.save();
      res.json(facultyMember).status(201);
    } catch (err) {
      res.json({ error: err }).status(500);
    }
  },

  async deleteFacultyMember(req, res) {
    try {
      const { id } = req.params;
      const deletedMember = await FacultyMember.findByIdAndDelete(id);
      if (!deletedMember) {
        res.json({ error: "Faculty member not found" }).status(404);
        return;
      }
      res.json("Faculty member deleted successfully").status(200);
    } catch (err) {
      res.json({ error: "Failed to delete Faculty member" }).status(500);
    }
  },
};

module.exports = { facultyMembersController };
