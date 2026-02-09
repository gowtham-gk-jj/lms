const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
  {
    // 🔗 Learner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔗 Course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    /* ===============================
       📘 LESSON COMPLETION
       =============================== */
    lessons: {
      type: Object,
      default: {
        beginner: false,
        intermediate: false,
        advanced: false,
      },
    },

    /* ===============================
       📝 QUIZ COMPLETION
       =============================== */
    quizzes: {
      type: Object,
      default: {
        beginner: false,
        intermediate: false,
        advanced: false,
      },
    },

    /* ===============================
       🔓 LEVEL UNLOCK SYSTEM
       =============================== */
    unlockedLevels: {
      type: [Number],
      default: [1],
      enum: [1, 2, 3],
    },

    /* ===============================
       ✅ COMPLETED LEVELS (QUIZ PASSED)
       =============================== */
    completedLevels: {
      type: [Number],
      default: [],
      enum: [1, 2, 3],
    },
  },
  {
    timestamps: true,
  }
);

/* ===============================
   🚀 INDEX
================================ */
courseProgressSchema.index(
  { user: 1, course: 1 },
  { unique: true }
);

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
