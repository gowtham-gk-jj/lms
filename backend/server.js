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
connectDB(); // ✅ Connect DB FIRST

const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lms-taupe-nine.vercel.app" // ✅ your Vercel frontend
    ],
    credentials: true,
  })
);

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
  res.send("LMS API is Running ✅");
});

// ================= SERVER + SOCKET =================
const server = http.createServer(app);
initSocket(server); // ✅ init socket ONCE

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
