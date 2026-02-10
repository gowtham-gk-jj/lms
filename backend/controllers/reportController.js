const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const QuizResult = require("../models/QuizResult");
const { generateCSV } = require("../utils/csvExport");

/**
 * ADMIN – Organization-wide report
 */
exports.getAdminReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // FIX: status does not exist → use progress === 100
    const completedCourses = await Enrollment.countDocuments({
      progress: 100,
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        completedCourses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * TRAINER – Course-level analytics (optional)
 */
exports.getTrainerCourseReport = async (req, res) => {
  try {
    const { courseId } = req.params;

    // FIX: userId → learner
    const enrollments = await Enrollment.find({ course: courseId })
      .populate("learner", "name email");

    // FIX: status → progress === 100
    const completed = enrollments.filter(
      (e) => e.progress === 100
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalStudents: enrollments.length,
        completed,
        progress: enrollments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * LEARNER – Individual performance report (optional)
 */
exports.getUserReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // FIX: userId → learner
    const enrollments = await Enrollment.find({ learner: userId })
      .populate("course", "title");

    // FIX: QuizResult usually stores learner/user reference as learner
    const quizzes = await QuizResult.find({ learner: userId });

    res.status(200).json({
      success: true,
      data: {
        enrollments,
        quizzes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * EXPORT REPORT AS CSV (ADMIN)
 */
exports.exportReportsCSV = async (req, res) => {
  try {
    // FIX: userId → learner
    const enrollments = await Enrollment.find()
      .populate("learner", "name email")
      .populate("course", "title");

    const csv = generateCSV(enrollments);

    res.header("Content-Type", "text/csv");
    res.attachment("reports.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
