const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    // 👤 Learner who attempted the quiz
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📘 Course of the quiz
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // 🎯 Quiz level
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    // 📊 Score obtained
    score: {
      type: Number,
      required: true,
      default: 0,
    },

    // 🧮 Total questions
    total: {
      type: Number,
      required: true,
    },

    // ✅ Pass / Fail (optional but useful)
    passed: {
      type: Boolean,
      default: false,
    },

    // ⏱ Attempt time
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🚀 Index for faster queries (important)
quizAttemptSchema.index({ user: 1, course: 1, level: 1 });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
