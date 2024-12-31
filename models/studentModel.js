const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String },
    academic_year: { type: Number, required: true },
  },
  { collection: "students" }
);

const Student = model("Student", studentSchema);

module.exports = Student;
