const { Schema, model } = require("mongoose");

const facultyMemberSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String },
  },
  { collection: "facultyMembers" }
);

const FacultyMember = model("FacultyMember", facultyMemberSchema);

module.exports = FacultyMember;
