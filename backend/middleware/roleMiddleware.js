// middleware/roleMiddleware.js

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    // req.user comes from authMiddleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permission",
      });
    }
    next();
  };
};

module.exports = roleMiddleware;
