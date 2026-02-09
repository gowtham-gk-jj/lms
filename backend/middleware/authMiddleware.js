const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ================= PROTECT ================= */
// Verifies the user is logged in
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
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

    // Attach user to request (IMPORTANT)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Contact admin.",
      });
    }

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/* ================= AUTHORIZE ================= */
// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: Role '${req.user?.role}' is not authorized`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
