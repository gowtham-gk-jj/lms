const Course = require("../models/Course");
const User = require("../models/User");
const { createBulkNotifications } = require("../services/notificationService");

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const imagePath = req.files?.image?.[0]?.path || "";
    const syllabusPath = req.files?.syllabus?.[0]?.path || "";

    // ✅ CREATE COURSE
    const course = await Course.create({
      title,
      description,
      image: imagePath,
      syllabus: syllabusPath,
      createdBy: req.user._id,
    });

    console.log("✅ Course created:", course.title);

    // ===============================
    // 🔔 NOTIFY ONLY LEARNERS (FIXED)
    // ===============================
    const learners = await User.find({
      role: { $in: ["learner", "student", "Learner", "Student"] }, // 🔥 FIX
    }).select("_id");

    console.log("👥 Learners found:", learners.length);

    if (learners.length === 0) {
      console.warn("⚠️ No learners found. Notification skipped.");
    }

    if (learners.length > 0) {
      try {
        await createBulkNotifications(
          learners.map((u) => u._id),
          {
            title: "New Course Available",
            message: `${course.title} course has been published`,
            type: "course",
          }
        );
        console.log("🔔 Course notifications created successfully");
      } catch (notifyErr) {
        console.error("❌ Notification service error:", notifyErr);
      }
    }

    res.status(201).json(course);
  } catch (err) {
    console.error("❌ Create course error:", err);
    res.status(500).json({ message: "Course creation failed" });
  }
};

exports.getTrainerCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user._id });
    res.json(courses);
  } catch (err) {
    console.error("❌ Get trainer courses error:", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};
