const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

// 1. Import Controllers
const { 
    loginUser, 
    createUser, 
    getUsers, 
    updateUserStatus, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');

// 2. Import Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @section SEED ROUTE
 * Visit: http://localhost:5000/api/auth/seed-admin to create first admin
 */
router.get('/seed-admin', async (req, res) => {
    try {
        const adminExists = await User.findOne({ email: 'admin@lms.com' });
        if (adminExists) return res.status(400).send('Admin already exists!');

        await User.create({
            name: 'System Administrator',
            email: 'admin@lms.com',
            password: 'password123', 
            role: 'admin',
            isActive: true
        });

        res.status(201).send('Admin created! Email: admin@lms.com, Pass: password123');
    } catch (error) {
        res.status(500).send('Error seeding admin: ' + error.message);
    }
});

/**
 * @section PUBLIC ROUTES
 */
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

/**
 * @section SHARED PROTECTED ROUTES (Admin & Trainer)
 */

// ✅ UPDATED: Added 'trainer' so they can see learners in the Assign Course dropdown
router.get('/users', protect, authorize('admin', 'trainer'), getUsers);

/**
 * @section ADMIN ONLY ROUTES
 */

// Create new user - Only Admin can register new people
router.post('/users', protect, authorize('admin'), createUser);

// Toggle user status (Activate/Deactivate) - Only Admin can block/unblock
router.put('/users/:id/status', protect, authorize('admin'), updateUserStatus);

module.exports = router;