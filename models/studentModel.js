const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    academic_year: { type: Number, required: true },
    total_credits: { type: Number, default: 0, min: 0 },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { collection: "students" }
);

const Student = model("Student", studentSchema);

module.exports = Student;
