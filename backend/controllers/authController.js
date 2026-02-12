const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// ==============================
// Helper to generate JWT Token
// ==============================
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ==============================
// LOGIN USER
// ==============================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account Deactivated' });
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==============================
// GET USERS
// ==============================
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    return res.status(200).json(users);
  } catch (error) {
    console.error("GetUsers Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// CREATE USER
// ==============================
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    return res.status(201).json(user);

  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// ==============================
// UPDATE USER STATUS
// ==============================
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: !user.isActive } },
      { new: true }
    );

    return res.json({
      message: 'Status updated successfully',
      isActive: updatedUser.isActive
    });

  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({
      message: "Server Error",
      details: error.message
    });
  }
};

// ==============================
// FORGOT PASSWORD
// ==============================
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "No account with that email exists"
      });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save({ validateBeforeSave: false });

    // ✅ USE ENV FRONTEND URL (IMPORTANT FOR RENDER)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
You requested a password reset.

Click the link below to reset your password:
${resetUrl}

If you did not request this, ignore this email.
`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message
      });

      return res.status(200).json({
        message: "Reset link sent to your email"
      });

    } catch (err) {

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: "Email could not be sent"
      });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ==============================
// RESET PASSWORD
// ==============================
const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token"
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginUser,
  getUsers,
  createUser,
  updateUserStatus,
  forgotPassword,
  resetPassword
};
