const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Enrollment = require("../models/Enrollment");

// ==============================
// GET ALL ENROLLMENT PROGRESS (ADMIN)
// ==============================
router.get(
  "/admin",
  protect,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const progress = await Enrollment.find()
        .populate("learner", "name email")
        .populate("course", "title");

      res.status(200).json({
        success: true,
        count: progress.length,
        data: progress,
      });
    } catch (err) {
      console.error("Admin Report Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch admin reports",
      });
    }
  }
);

module.exports = router;
