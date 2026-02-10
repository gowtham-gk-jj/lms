const express = require("express");
const router = express.Router();

const {
  getAdminReports,
  exportReportsCSV,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ================= ADMIN ONLY REPORTS =================

// View all reports
router.get(
  "/admin",
  protect,
  roleMiddleware("admin"),
  getAdminReports
);

// Download reports (CSV)
router.get(
  "/export",
  protect,
  roleMiddleware("admin"),
  exportReportsCSV
);

module.exports = router;
