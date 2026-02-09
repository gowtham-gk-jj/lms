const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

/**
 * GET Dashboard Stats
 * GET /api/dashboard/stats/:role
 */
router.get("/stats/:role", async (req, res) => {
  const { role } = req.params;

  try {
    // ================= ADMIN =================
    if (role === "Admin") {
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();

      const progressData = await Progress.find();
      const avgCompletion =
        progressData.reduce((sum, p) => sum + (p.completion || 0), 0) /
        (progressData.length || 1);

      return res.json({
        users: totalUsers,
        courses: totalCourses,
        averageCompletion: Math.round(avgCompletion),
        message: "Organization learning overview",
      });
    }

    // ================= TRAINER =================
    if (role === "Trainer") {
      const trainerCourses = await Course.find();
      const courseIds = trainerCourses.map((c) => c._id);

      const progressData = await Progress.find({
        course: { $in: courseIds },
      });

      const avgCompletion =
        progressData.reduce((sum, p) => sum + (p.completion || 0), 0) /
        (progressData.length || 1);

      return res.json({
        coursesHandled: trainerCourses.length,
        avgCompletion: Math.round(avgCompletion),
        message: "Your courses are progressing well",
      });
    }

    // ================= LEARNER =================
    if (role === "Learner") {
      const learnerProgress = await Progress.find();

      const avgCompletion =
        learnerProgress.reduce((sum, p) => sum + (p.completion || 0), 0) /
        (learnerProgress.length || 1);

      return res.json({
        enrolledCourses: learnerProgress.length,
        personalProgress: Math.round(avgCompletion),
        message: "Keep learning, you're doing great",
      });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("Dashboard API error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
