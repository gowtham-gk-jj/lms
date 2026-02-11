const express = require("express");
const router = express.Router();
const multer = require("multer");
const Course = require("../models/Course");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { createBulkNotifications } = require("../services/notificationService");

/* ================= MULTER CONFIG ================= */
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
        image: req.files?.image?.[0]?.path?.replace(/\\/g, "/"),
        syllabus: req.files?.syllabus?.[0]?.path?.replace(/\\/g, "/"),
        trainer: req.user._id,
        levels: [],
      });

      /* 🔔 Notify Learners */
      const learners = await User.find({
        role: { $in: ["learner", "student", "Learner", "Student"] },
      }).select("_id");

      if (learners.length > 0) {
        await createBulkNotifications(
          learners.map((u) => u._id),
          {
            title: "New Course Available",
            message: `${course.title} course has been published`,
            type: "course",
          }
        );
      }

      res.status(201).json(course);
    } catch (error) {
      console.error("CREATE COURSE ERROR:", error);
      res.status(500).json({ message: "Course creation failed" });
    }
  }
);

/* ================= GET COURSES ================= */
router.get("/", protect, async (req, res) => {
  try {
    let courses;

    if (req.user.role === "admin") {
      courses = await Course.find();
    } else {
      courses = await Course.find({ trainer: req.user._id });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("FETCH COURSES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

/* ================= PUBLIC COURSES ================= */
router.get("/public", async (req, res) => {
  try {
    const courses = await Course.find();

    const fixedCourses = courses.map((course) => ({
      ...course._doc,
      image: course.image?.replace(/\\/g, "/"),
      syllabus: course.syllabus?.replace(/\\/g, "/"),
    }));

    res.status(200).json(fixedCourses);
  } catch (error) {
    console.error("PUBLIC COURSES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch public courses" });
  }
});

router.get("/public/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      ...course._doc,
      image: course.image?.replace(/\\/g, "/"),
      syllabus: course.syllabus?.replace(/\\/g, "/"),
    });
  } catch (error) {
    console.error("PUBLIC COURSE ERROR:", error);
    res.status(400).json({ message: "Invalid course ID" });
  }
});
/* ================= GET COURSE BY ID (PROTECTED) ================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only owner trainer or admin can view
    if (
      req.user.role !== "admin" &&
      course.trainer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("GET COURSE BY ID ERROR:", error);
    res.status(400).json({ message: "Invalid course ID" });
  }
});

/* ================= ADD LEVEL ================= */
router.post("/:id/levels", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only owner trainer or admin can add level
    if (
      req.user.role !== "admin" &&
      course.trainer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    course.levels.push({
      name: req.body.level,
      videoUrl: req.body.videoUrl,
      quiz: "coming-soon",
    });

    await course.save();
    res.status(200).json(course);
  } catch (error) {
    console.error("ADD LEVEL ERROR:", error);
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

      if (
        req.user.role !== "admin" &&
        course.trainer.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      course.title = req.body.title || course.title;
      course.description = req.body.description || course.description;

      if (req.files?.image?.length) {
        course.image = req.files.image[0].path.replace(/\\/g, "/");
      }

      if (req.files?.syllabus?.length) {
        course.syllabus = req.files.syllabus[0].path.replace(/\\/g, "/");
      }

      await course.save();

      res.status(200).json({
        message: "Course updated successfully",
        course,
      });
    } catch (error) {
      console.error("UPDATE COURSE ERROR:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  }
);

/* ================= DELETE COURSE ================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      req.user.role !== "admin" &&
      course.trainer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await course.deleteOne();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

module.exports = router;
