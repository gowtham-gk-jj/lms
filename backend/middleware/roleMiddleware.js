const express = require("express");
const router = express.Router();
const { createCourse, getTrainerCourses } = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware"); // The one you gave me before
const roleMiddleware = require("../middleware/roleMiddleware"); // This one

// Only Trainers can create courses
router.post("/create", protect, roleMiddleware("trainer"), createCourse);

// Only Trainers can see their own course list
router.get("/my-courses", protect, roleMiddleware("trainer"), getTrainerCourses);

module.exports = router;