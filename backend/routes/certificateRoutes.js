const express = require('express');
const router = express.Router();

const {
  issueCertificate,
  getUserCertificates,
  getAllCertificates
} = require('../controllers/certificateController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Issue certificate
router.post('/issue/:courseId', protect, issueCertificate);

// ✅ Get logged-in user's certificates
router.get('/my', protect, getUserCertificates);

// Get all certificates (admin/trainer)
router.get('/all', protect, authorize('admin', 'trainer'), getAllCertificates);

module.exports = router;
