const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/certificateModel");
const Course = require("../models/Course");
const { protect, authorize } = require("../middleware/authMiddleware");
const { createNotification } = require("../services/notificationService"); // ✅ ADDED

/* ===============================
   ADMIN / TRAINER ENROLL LEARNER
================================ */
router.post(
  "/enroll",
  protect,
  authorize("admin", "trainer"),
  async (req, res) => {
    try {
      const { learnerId, courseId } = req.body;

      if (!learnerId || !courseId) {
        return res.status(400).json({
          message: "Learner ID and Course ID are required",
        });
      }

      const existing = await Enrollment.findOne({
        learner: learnerId,
        course: courseId,
      });

      if (existing) {
        return res.status(400).json({
          message: "Learner already enrolled in this course",
        });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const enrollment = new Enrollment({
        learner: learnerId,
        course: courseId,
        completedLessons: [],
        completedQuizzes: [],
        progress: 0,
      });

      await enrollment.save();

      // 🔔 CREATE ENROLLMENT NOTIFICATION (FIX)
      await createNotification({
        userId: learnerId,
        title: "Course Enrollment",
        message: `You have been enrolled in ${course.title}`,
        type: "enrollment",
      });

      console.log("🔔 Enrollment notification created");

      res.status(201).json({
        message: "Learner enrolled successfully",
        enrollment,
      });
    } catch (err) {
      console.error("Enroll learner error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ===============================
   LEARNER – VIEW MY COURSES
================================ */
router.get("/my-courses", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      learner: req.user._id,
    }).populate("course");

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   UPDATE LEVEL PROGRESS
================================ */
router.patch("/update-progress", protect, async (req, res) => {
  try {
    const { enrollmentId, levelId } = req.body;

    if (!enrollmentId || !levelId) {
      return res.status(400).json({
        message: "Enrollment ID and Level ID are required",
      });
    }

    const enrollment = await Enrollment.findById(enrollmentId).populate(
      "course"
    );

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    if (enrollment.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!enrollment.completedLessons.includes(levelId)) {
      enrollment.completedLessons.push(levelId);
    }

    const totalLevels = enrollment.course.levels.length || 1;

    enrollment.progress = Math.round(
      (enrollment.completedLessons.length / totalLevels) * 100
    );

    await enrollment.save();

    res.json({
      message: "Level completed successfully",
      enrollment,
    });
  } catch (err) {
    console.error("Progress Update Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   MARK QUIZ AS COMPLETED + ISSUE CERTIFICATE
================================ */
router.post("/complete-quiz", protect, async (req, res) => {
  try {
    const { courseId, level } = req.body;

    if (!courseId || !level) {
      return res.status(400).json({
        message: "courseId and level are required",
      });
    }

    const enrollment = await Enrollment.findOne({
      learner: req.user._id,
      course: courseId,
    }).populate("course");

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    const levelObj = enrollment.course.levels.find(
      (l) => l.name.toLowerCase() === level.toLowerCase()
    );

    if (!levelObj) {
      return res.status(400).json({
        message: "Invalid level",
      });
    }

    const levelId = levelObj._id.toString();

    enrollment.completedLessons = enrollment.completedLessons || [];
    enrollment.completedQuizzes = enrollment.completedQuizzes || [];

    if (!enrollment.completedLessons.includes(levelId)) {
      enrollment.completedLessons.push(levelId);
    }

    if (!enrollment.completedQuizzes.includes(levelId)) {
      enrollment.completedQuizzes.push(levelId);
    }

    enrollment.progress = Math.round(
      (enrollment.completedLessons.length /
        enrollment.course.levels.length) *
        100
    );

    await enrollment.save();

    const allCompleted =
      enrollment.completedLessons.length ===
      enrollment.course.levels.length;

    if (allCompleted) {
      const alreadyIssued = await Certificate.findOne({
        userId: req.user._id,
        courseId,
      });

      if (!alreadyIssued) {
        await Certificate.create({
          userId: req.user._id,
          learnerName: req.user.name,
          courseName: enrollment.course.title,
          courseId,
          certificateId: `CERT-${Date.now()}`,
          issueDate: new Date(),
        });
      }
    }

    res.json({
      message: "Quiz completed successfully",
      enrollment,
    });
  } catch (err) {
    console.error("Complete quiz error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
