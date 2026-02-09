const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // ✅ COMPLETED VIDEOS (LEVELS)
    completedLessons: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },

    // ✅ COMPLETED QUIZZES (PASS ONLY)
    completedQuizzes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },

    progress: {
      type: Number,
      default: 0,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
