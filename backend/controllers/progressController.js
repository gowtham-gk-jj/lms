const CourseProgress = require("../models/CourseProgress");

/* =====================================
   DEFAULT PROGRESS STRUCTURE
===================================== */
const defaultProgress = {
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
  progress: 0,
};

/* =====================================
   CALCULATE TOTAL PROGRESS %
===================================== */
const calculateProgress = (progressDoc) => {
  const lessonValues = Object.values(progressDoc.lessons);
  const quizValues = Object.values(progressDoc.quizzes);

  const totalItems = lessonValues.length + quizValues.length;
  const completedItems =
    lessonValues.filter(Boolean).length +
    quizValues.filter(Boolean).length;

  return Math.round((completedItems / totalItems) * 100);
};

/* =====================================
   GET COURSE PROGRESS
===================================== */
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
        ...defaultProgress,
      });
    }

    return res.status(200).json({
      success: true,
      lessons: progress.lessons,
      quizzes: progress.quizzes,
      progress: progress.progress || 0,
    });
  } catch (err) {
    console.error("Progress error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch progress" });
  }
};

/* =====================================
   MARK LESSON COMPLETED
===================================== */
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
        ...defaultProgress,
      });
    }

    // ✅ Mark lesson complete
    progress.lessons[level] = true;

    // ✅ Unlock next level automatically
    const levelMap = {
      beginner: 2,
      intermediate: 3,
      advanced: null,
    };

    const nextLevel = levelMap[level];
    if (nextLevel && !progress.unlockedLevels.includes(nextLevel)) {
      progress.unlockedLevels.push(nextLevel);
    }

    // ✅ Recalculate progress %
    progress.progress = calculateProgress(progress);

    // ✅ Mark course completed if 100%
    if (progress.progress === 100) {
      progress.completed = true;
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      lessons: progress.lessons,
      progress: progress.progress,
      unlockedLevels: progress.unlockedLevels,
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
