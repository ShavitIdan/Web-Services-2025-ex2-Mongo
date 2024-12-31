const { Schema, model } = require("mongoose");

const facultyMemberSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  { collection: "facultyMembers" }
);

const FacultyMember = model("FacultyMember", facultyMemberSchema);

module.exports = FacultyMember;
