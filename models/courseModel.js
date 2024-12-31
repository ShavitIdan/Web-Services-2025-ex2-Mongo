const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    id: { type: Number },
    name: { type: String },
    lecturer: { type: String },
    credits: { type: Number },
    capacity: { type: Number },
  },
  { collection: "courses" }
);

const Course = model("Course", courseSchema);

module.exports = Course;
