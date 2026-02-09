const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ================= PROTECT ================= */
// Verifies the user is logged in
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object (excluding password)
    // IMPORTANT: Matching 'decoded.id' from your authController's generateToken function
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if account is active (Safety check for Module 5)
    if (!req.user.isActive) {
      return res.status(403).json({ message: "Account is deactivated. Contact admin." });
    }

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/* ================= ADMIN ONLY ================= */
// Restricts access to Admin roles
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

/* ================= TRAINER ONLY ================= */
// Restricts access to Trainer/Instructor roles
exports.trainerOnly = (req, res, next) => {
  if (req.user && (req.user.role === "trainer" || req.user.role === "instructor")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Trainer only." });
  }
};