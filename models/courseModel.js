const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    lecturer: { type: String, required: true },
    credits: { type: Number, required: true, min: 3, max: 5 },
    capacity: { type: Number, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  },
  { collection: "courses" }
);

const Course = model("Course", courseSchema);

module.exports = Course;
