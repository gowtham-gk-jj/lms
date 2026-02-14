const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

/* GENERATE TOKEN */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/* LOGIN */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
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

/* GET USERS */
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* CREATE USER */
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* UPDATE STATUS */
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.json({
      message: 'Status updated',
      isActive: user.isActive
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* FORGOT PASSWORD */
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "No account found" });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message: `Reset your password here: ${resetUrl}`
    });

    return res.json({ message: "Reset link sent" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* RESET PASSWORD */
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({ message: "Password reset successful" });

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
