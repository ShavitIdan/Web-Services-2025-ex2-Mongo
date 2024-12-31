const { Schema, model } = require("mongoose");
const Course = require("./courseModel");

const studentSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    academic_year: { type: Number, required: true },
    Courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { collection: "students" }
);

const Student = model("Student", studentSchema);

module.exports = Student;
