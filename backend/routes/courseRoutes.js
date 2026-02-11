const express = require("express");
const router = express.Router();
const multer = require("multer");
const Course = require("../models/Course");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const { createBulkNotifications } = require("../services/notificationService");

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ================= CREATE COURSE ================= */
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "syllabus", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const course = await Course.create({
        title: req.body.title,
        description: req.body.description,
        image: req.files?.image?.[0]?.path,
        syllabus: req.files?.syllabus?.[0]?.path,
        trainer: req.user._id,
        levels: [],
      });

      console.log("✅ Course created:", course.title);

      /* ================= 🔔 CREATE NOTIFICATION FOR LEARNERS ================= */
      const learners = await User.find({
        role: { $in: ["learner", "student", "Learner", "Student"] },
      }).select("_id");

      console.log("👥 Learners found:", learners.length);

      if (learners.length > 0) {
        await createBulkNotifications(
          learners.map((u) => u._id),
          {
            title: "New Course Available",
            message: `${course.title} course has been published`,
            type: "course",
          }
        );
        console.log("🔔 Course notifications created");
      }

      res.json(course);
    } catch (error) {
      console.error("CREATE COURSE ERROR:", error);
      res.status(500).json({ message: "Course creation failed" });
    }
  }
);

/* ================= GET COURSES (ADMIN / TRAINER FIX) ================= */
router.get("/", protect, async (req, res) => {
  try {
    let courses = [];

    if (req.user.role === "admin") {
      courses = await Course.find();
    } else {
      courses = await Course.find({ trainer: req.user._id });
    }

    res.json(courses);
  } catch (error) {
    console.error("FETCH COURSES ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

/* ================= PUBLIC COURSES ================= */
router.get("/public", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error("PUBLIC COURSES ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch public courses" });
  }
});

/* ================= SINGLE PUBLIC COURSE ================= */
router.get("/public/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("PUBLIC COURSE ERROR:", error.message);
    res.status(400).json({ message: "Invalid ID" });
  }
});

/* ================= ADD LEVEL ================= */
router.post("/:id/levels", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.levels.push({
      name: req.body.level,
      videoUrl: req.body.videoUrl,
      quiz: "coming-soon",
    });

    await course.save();
    res.json(course);
  } catch (error) {
    console.error("ADD LEVEL ERROR:", error.message);
    res.status(500).json({ message: "Failed to add level" });
  }
});

/* ================= UPDATE COURSE ================= */
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "syllabus", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      course.title = req.body.title || course.title;
      course.description = req.body.description || course.description;

      if (req.files?.image?.length) {
        course.image = req.files.image[0].path;
      }

      if (req.files?.syllabus?.length) {
        course.syllabus = req.files.syllabus[0].path;
      }

      await course.save();
      res.json({ message: "Course updated successfully", course });
    } catch (error) {
      console.error("UPDATE COURSE ERROR:", error.message);
      res.status(500).json({ message: "Failed to update course" });
    }
  }
);

/* ================= DELETE COURSE ================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error.message);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

module.exports = router;
