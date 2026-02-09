const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  getCourseProgress,
  markLessonCompleted,
} = require("../controllers/progressController");

router.get("/:courseId", protect, getCourseProgress);
router.post("/lesson/:courseId/:level", protect, markLessonCompleted);

module.exports = router;
