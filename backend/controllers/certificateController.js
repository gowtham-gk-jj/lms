const Certificate = require("../models/certificateModel");
const Course = require("../models/Course");
const Organization = require("../models/Organization");

/**
 * @desc    Issue a new certificate (manual or auto)
 * @route   POST /api/certificates/issue/:courseId
 * @access  Private
 */
exports.issueCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 🔎 Fetch course to get name
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🚫 Prevent duplicate certificates
    const existing = await Certificate.findOne({
      userId: req.user._id,
      courseId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Certificate already issued for this course",
      });
    }

    const certificate = await Certificate.create({
      userId: req.user._id,
      learnerName: req.user.name,
      courseName: course.title,
      courseId,
      certificateId: `CERT-${Date.now()}`,
      issueDate: new Date(),
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error("Issue certificate error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged-in user's certificates (WITH LOGO)
 * @route   GET /api/certificates/my
 * @access  Private
 */
exports.getUserCertificates = async (req, res) => {
  try {
    const org = await Organization.findOne();

    const certs = await Certificate.find({
      userId: req.user._id,
    }).sort({ issueDate: -1 });

    const enrichedCerts = certs.map((cert) => ({
      ...cert.toObject(),
      orgLogo: org?.logo || "",
      themeColor: org?.themeColor || "#2563eb",
    }));

    res.json(enrichedCerts);
  } catch (error) {
    console.error("Get user certificates error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all certificates (Admin / Trainer) WITH LOGO
 * @route   GET /api/certificates/all
 * @access  Private (Admin/Trainer)
 */
exports.getAllCertificates = async (req, res) => {
  try {
    const org = await Organization.findOne();

    const certs = await Certificate.find()
      .populate("userId", "name email")
      .sort({ issueDate: -1 });

    const enrichedCerts = certs.map((cert) => ({
      ...cert.toObject(),
      orgLogo: org?.logo || "",
      themeColor: org?.themeColor || "#2563eb",
    }));

    res.json(enrichedCerts);
  } catch (error) {
    console.error("Get all certificates error:", error);
    res.status(500).json({ message: error.message });
  }
};
