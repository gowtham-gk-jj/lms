const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const http = require("http");

const connectDB = require("./config/db");
const { initSocket } = require("./socket");
const reportRoutes = require("./routes/reportRoutes");

// ================= INIT =================
dotenv.config();
connectDB();

const app = express();

// ================= CORS CONFIG (FINAL FIX) =================
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-to-server
      if (!origin) return callback(null, true);

      // Allow localhost
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // Allow Vercel
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // ✅ Allow Netlify
      if (origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/organization", require("./routes/organizationRoutes"));
app.use("/api/articles", require("./routes/articleRoutes"));
app.use("/api/enrollment", require("./routes/enrollmentRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/reports", reportRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).send("✅ LMS API is Running");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================= SERVER + SOCKET =================
const server = http.createServer(app);
initSocket(server);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
