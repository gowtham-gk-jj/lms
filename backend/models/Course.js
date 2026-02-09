const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Beginner / Intermediate / Advanced
  },
  videoUrl: {
    type: String,
    default: "",
  },
  quiz: {
    type: String,
    default: "coming-soon",
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    syllabus: String,
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    levels: [levelSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
