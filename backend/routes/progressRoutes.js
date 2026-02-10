const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Enrollment = require("../models/Enrollment");

router.get(
  "/",
  protect,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const progress = await Enrollment.find()
        .populate("learner", "name email")
        .populate("course", "title");

      res.json(progress);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
