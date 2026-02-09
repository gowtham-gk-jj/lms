const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    // 🔗 User who attempted the quiz
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔗 Course for which quiz was taken
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // 🎯 Quiz level (stored as string for readability & reports)
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },

    // 🧮 Score obtained
    score: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🧾 Total number of questions
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    // 📊 Percentage (auto-calculated)
    percentage: {
      type: Number,
      default: function () {
        if (!this.totalQuestions) return 0;
        return Math.round((this.score / this.totalQuestions) * 100);
      },
    },

    // 🧠 User answers (QuestionId → selected option)
    // Needed for quiz review
    answers: {
      type: Map,
      of: String,
      required: true,
    },

    // ✅ Pass / Fail status
    passed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* ===============================
   🚀 INDEXES (IMPORTANT)
================================ */
// Prevent duplicate attempts for same level if you want later
quizResultSchema.index({ user: 1, course: 1, level: 1 });

// Faster trainer analytics & reports
quizResultSchema.index({ course: 1, createdAt: -1 });

module.exports = mongoose.model("QuizResult", quizResultSchema);
