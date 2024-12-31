const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    id: { type: Number },
    name: { type: String, required: true },
    lecturer: { type: String },
    credits: { type: Number, required: true },
    capacity: { type: Number },
  },
  { collection: "courses" }
);

const Course = model("Course", courseSchema);

module.exports = Course;
