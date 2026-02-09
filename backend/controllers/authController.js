const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper to generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) return res.status(403).json({ message: 'Account Deactivated' });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin)
// @desc    Get all users (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    console.log("Users found in DB:", users.length);

    // The 'return' ensures the function stops immediately after sending the response
    return res.status(200).json(users); 

  } catch (error) {
    console.error("GetUsers Error:", error.message);
    // Use 'return' here too to prevent falling through to other code
    return res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create User (Admin)
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    console.error("Mongoose validation error:",error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Deactivate/Activate User (Admin)
const updateUserStatus = async (req, res) => {
  try {
    // 1. First, find the user to know their CURRENT status
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Use findByIdAndUpdate instead of user.save()
    // This BYPASSES the password hashing middleware in User.js
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: !user.isActive } }, // Toggle the value
      { new: true, runValidators: false }    // Return the updated doc
    );

    console.log("✅ Update Successful. New status:", updatedUser.isActive);

    return res.json({
      message: 'Status updated successfully',
      isActive: updatedUser.isActive
    });

  } catch (error) {
    // We log the full error here so you can see it in the terminal
    console.error("🚨 Backend Error:", error);
    
    return res.status(500).json({ 
      message: "Server Error", 
      details: error.message 
    });
  }
};

const sendEmail = require('../utils/sendEmail');

const forgotPassword = async (req, res) => {
  try{
    const user = await User.findOne({ email: req.body.email });
    if(!user){
      return res.status(404).json({message:"No account with that email exists"});
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10*60*1000;
    await user.save({validateBeforeSave: false});

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `You are receiving this email because you requested a password reset. Please click on this link: \n\n ${resetUrl}`;

    try{
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message
      });
      res.status(200).json({message:"Reset link sent to  your email"});
    }catch(err){
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ calidateBeforeSave: false});
      return res.status(500).json({message:"Email could not be sent"});
    }
  } catch(error){
    console.error(error);
    res.status(500).json({message: error.message});
  }
};

const resetPassword = async (req, res) => {
  try{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({resetPasswordToken, resetPasswordExpire:{$gt:Date.now()},});
    if(!user){
      return res.status(400).json({ message: "Invalid or expired reset token"});
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();

    res.status(200).json({message: "Password reset successful"});
  }catch(error){
    res.status(500).json({message: error.message})
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