const FacultyMember = require("../models/facultyMemberModel");

const facultyMembersController = {
  async getAllFacultyMembers(req, res) {
    try {
      const facultyMembers = await FacultyMember.find({});
      res.status(200).json({ success: true, data: facultyMembers });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch faculty members",
        details: err.message,
      });
    }
  },

  async addFacultyMember(req, res) {
    try {
      const { id, name, address } = req.body;
      if (!id || !name || !address) {
        return res.status(400).json({
          success: false,
          error: "Please provide all required fields",
        });
        return;
      }
      const facultyMember = new FacultyMember({ id, name, address });
      await facultyMember.save();
      res.status(201).json({ success: true, data: facultyMember });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Failed to add faculty member",
        details: err.message,
      });
    }
  },

  async deleteFacultyMember(req, res) {
    try {
      const { id } = req.params;
      const deletedMember = await FacultyMember.findByIdAndDelete(id);
      if (!deletedMember) {
        return res
          .status(404)
          .json({ success: false, error: "Faculty member not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Faculty member deleted successfully",
      });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          error: "Failed to delete faculty member",
          details: err.message,
        });
    }
  },
};

module.exports = { facultyMembersController };
