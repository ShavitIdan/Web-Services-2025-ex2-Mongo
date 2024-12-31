const { Schema, model } = require("mongoose");

const facultyMemberSchema = new Schema(
  {
    id: { type: Number },
    name: { type: String },
    address: { type: String },
  },
  { collection: "facultyMembers" }
);

const FacultyMember = model("FacultyMember", facultyMemberSchema);

module.exports = FacultyMember;
