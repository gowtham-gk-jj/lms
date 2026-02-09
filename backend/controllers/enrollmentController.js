const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const { createNotification } = require("../services/notificationService");

/* ===============================
   ADMIN / TRAINER ENROLL LEARNER
================================ */
exports.adminEnrollLearner = async (req, res) => {
  try {
    const { learnerId, courseId } = req.body;

    if (!learnerId || !courseId) {
      return res.status(400).json({
        message: "Learner ID and Course ID are required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
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

    const enrollment = await Enrollment.create({
      learner: learnerId,
      course: courseId,
      completedLessons: [],
      completedQuizzes: [],
      progress: 0,
    });

    // 🔔 ENROLLMENT NOTIFICATION (FIX)
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
  } catch (error) {
    console.error("Admin enroll error:", error);
    res.status(500).json({ message: "Enrollment failed" });
  }
};

/* ===============================
   COMPLETE QUIZ + CERTIFICATE
================================ */
exports.completeQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, level } = req.body;

    const enrollment = await Enrollment.findOne({
      learner: userId,
      course: courseId,
    }).populate("course");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const levelObj = enrollment.course.levels.find(
      (l) => l.name.toLowerCase() === level.toLowerCase()
    );

    if (!levelObj) {
      return res.status(404).json({ message: "Level not found" });
    }

    const levelId = levelObj._id.toString();

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
        userId,
        courseId,
      });

      if (!alreadyIssued) {
        await Certificate.create({
          userId,
          learnerName: req.user.name,
          courseName: enrollment.course.title,
          courseId,
          certificateId: `CERT-${Date.now()}`,
          issueDate: new Date(),
        });

        // 🔔 COURSE COMPLETION NOTIFICATION
        await createNotification({
          userId,
          title: "Course Completed 🎓",
          message: `You have successfully completed ${enrollment.course.title}. Certificate issued.`,
          type: "course",
        });
      }
    }

    res.json({
      success: true,
      message: "Quiz completed successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Complete Quiz Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   LEARNER – VIEW MY COURSES
================================ */
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      learner: req.user._id,
    }).populate("course");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
