const express = require('express');
const router = express.Router();

const {
  loginUser,
  createUser,
  getUsers,
  updateUserStatus,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

/* PUBLIC */
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

/* ADMIN + INSTRUCTOR */
router.get('/users', protect, authorize('admin', 'instructor'), getUsers);

/* ADMIN ONLY */
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id/status', protect, authorize('admin'), updateUserStatus);

module.exports = router;
