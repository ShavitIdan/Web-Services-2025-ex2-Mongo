const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    id: { type: Number },
    name: { type: String },
    address: { type: String },
    academic_year: { type: Number },
  },
  { collection: "students" }
);

const Student = model("Student", studentSchema);

module.exports = Student;
