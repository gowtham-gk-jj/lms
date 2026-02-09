const CourseProgress = require("../models/CourseProgress");

/* ===============================
   GET COURSE PROGRESS
================================ */
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    let progress = await CourseProgress.findOne({
      user: userId,
      course: courseId,
    });

    // ✅ Create default progress if not exists
    if (!progress) {
      progress = await CourseProgress.create({
        user: userId,
        course: courseId,
        lessons: {
          beginner: false,
          intermediate: false,
          advanced: false,
        },
        quizzes: {
          beginner: false,
          intermediate: false,
          advanced: false,
        },
        unlockedLevels: [1],
        completedLevels: [],
      });
    }

    return res.status(200).json({
      lessons: progress.lessons,
      quizzes: progress.quizzes,
    });
  } catch (err) {
    console.error("Progress error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch progress" });
  }
};

/* ===============================
   MARK LESSON COMPLETED
================================ */
const markLessonCompleted = async (req, res) => {
  try {
    const { courseId, level } = req.params;
    const userId = req.user.id;

    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }

    let progress = await CourseProgress.findOne({
      user: userId,
      course: courseId,
    });

    // ✅ Create progress if missing
    if (!progress) {
      progress = await CourseProgress.create({
        user: userId,
        course: courseId,
        lessons: {
          beginner: false,
          intermediate: false,
          advanced: false,
        },
        quizzes: {
          beginner: false,
          intermediate: false,
          advanced: false,
        },
        unlockedLevels: [1],
        completedLevels: [],
      });
    }

    // ✅ MARK LESSON AS COMPLETED
    progress.lessons[level] = true;
    await progress.save();

    return res.status(200).json({
      success: true,
      lessons: progress.lessons,
    });
  } catch (err) {
    console.error("Lesson update error:", err);
    return res
      .status(500)
      .json({ message: "Failed to update lesson progress" });
  }
};

module.exports = {
  getCourseProgress,
  markLessonCompleted,
};
