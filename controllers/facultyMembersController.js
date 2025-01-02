const FacultyMember = require("../models/facultyMemberModel");

const facultyMembersController = {
  async addFacultyMember(data) {
    try {
      const { name, address } = data;

      if (!name || !address) {
        throw new Error("Please provide all required fields");
      }

      const facultyMember = new FacultyMember({ name, address });
      await facultyMember.save();
      return facultyMember;
    } catch (err) {
      console.error("Failed to add faculty member:", err.message);
      throw new Error("Failed to add faculty member: " + err.message);
    }
  },
};

module.exports = { facultyMembersController };
