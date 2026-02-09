const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessons: {
      beginner: { type: Boolean, default: false },
      intermediate: { type: Boolean, default: false },
      advanced: { type: Boolean, default: false },
    },
    quizzes: {
      beginner: { type: Boolean, default: false },
      intermediate: { type: Boolean, default: false },
      advanced: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
