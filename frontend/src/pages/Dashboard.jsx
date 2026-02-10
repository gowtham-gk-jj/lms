import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔐 Admin-only protection
  if (user?.role?.toLowerCase() !== "admin") {
    return (
      <div className="db-wrapper">
        <h1>Access Denied</h1>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="db-wrapper">
      {/* ================= ADMIN WELCOME ================= */}
      <header className="db-welcome">
        <h1>Welcome, {user?.name || "System Administrator"}</h1>
        <p className="db-subtitle">
          Manage your platform&apos;s users, content, and settings from here.
        </p>
      </header>

      {/* ================= ADMIN DASHBOARD CARDS ================= */}
      <div className="db-grid">
        {/* OVERVIEW */}
        <div
          className="db-card"
          onClick={() => navigate("/admin-dashboard/overview")}
        >
          <h3 className="db-card-title">Overview</h3>
          <p className="db-card-desc">
            View platform-wide statistics and learning progress.
          </p>
        </div>

        {/* MANAGE USERS */}
        <div
          className="db-card"
          onClick={() => navigate("/admin-dashboard/users")}
        >
          <h3 className="db-card-title">Manage Users</h3>
          <p className="db-card-desc">
            View, edit, and update status for all registered users.
          </p>
        </div>

        {/* REGISTER USER */}
        <div
          className="db-card"
          onClick={() => navigate("/admin-dashboard/users/create")}
        >
          <h3 className="db-card-title">Register New User</h3>
          <p className="db-card-desc">
            Onboard new Learners, Trainers, or Administrators.
          </p>
        </div>

        {/* CREATE ARTICLE */}
        <div
          className="db-card"
          onClick={() => navigate("/admin-dashboard/articles/create")}
        >
          <h3 className="db-card-title">Create Article</h3>
          <p className="db-card-desc">
            Write and publish learning content.
          </p>
        </div>

        {/* ENROLL LEARNER */}
        <div
          className="db-card"
          onClick={() => navigate("/admin-dashboard/enroll")}
        >
          <h3 className="db-card-title">Enroll Learner</h3>
          <p className="db-card-desc">
            Assign courses to learners.
          </p>
        </div>

        {/* LEARNER PROGRESS */}
        <div
          className="db-card"
          onClick={() => navigate("/admin-dashboard/progress")}
        >
          <h3 className="db-card-title">Learner Progress</h3>
          <p className="db-card-desc">
            Monitor course completion and performance.
          </p>
        </div>

        {/* 📊 REPORTS (NEW) */}
        <div
          className="db-card"
          onClick={() => navigate("/admin-dashboard/reports")}
        >
          <h3 className="db-card-title">Reports</h3>
          <p className="db-card-desc">
            Download organization-wide learning reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
