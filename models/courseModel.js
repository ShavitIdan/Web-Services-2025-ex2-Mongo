const { Schema, model } = require("mongoose");
const Student = require("./studentModel");

const courseSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    lecturer: { type: String, required: true },
    credits: { type: Number, required: true, min: 3, max: 5 },
    capacity: { type: Number, required: true, min: 1 },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  },
  { collection: "courses" }
);
courseSchema.pre("findOneAndDelete", async function (next) {
  try {
    const courseId = this.getQuery()._id;

    const course = await this.model.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const courseCredits = course.credits;

    await Student.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId }, $inc: { total_credits: -courseCredits } }
    );
    next();
  } catch (err) {
    console.error(
      "Error cleaning up course references from students:",
      err.message
    );
    next(err);
  }
});

courseSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toLowerCase();
  }
  next();
});

courseSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.name) {
    update.name = update.name.toLowerCase();
  }

  next();
});

const Course = model("Course", courseSchema);

module.exports = Course;
