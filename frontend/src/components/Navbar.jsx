import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/axios"; // ✅ CHANGED
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔔 UNREAD COUNT STATE
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const role = user?.role;
  const isAdmin = role === "admin";
  const isTrainer = role === "trainer" || role === "instructor";
  const isLearner = role === "learner" || role === "student";

  const isActive = (path) => location.pathname.startsWith(path);

  /* ================= ROLE OVERVIEW PATH ================= */
  const getOverviewPath = () => {
    if (isAdmin) return "/admin-dashboard/overview";
    if (isTrainer) return "/trainer-dashboard/overview";
    if (isLearner) return "/learner-dashboard/overview";
    return "/";
  };

  /* ================= FETCH NOTIFICATIONS ================= */
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        // ✅ FIXED API (no localhost, no manual token)
        const res = await api.get("/notifications");

        const unread = Array.isArray(res.data)
          ? res.data.filter((n) => !n.isRead)
          : [];

        setUnreadCount(unread.length);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo">
          <Link to="/">LMS</Link>
        </div>

        {/* LINKS */}
        <nav className="navbar-links">
          <Link
            to="/"
            className={
              isActive("/") && !isAdmin && !isTrainer
                ? "nav-active"
                : ""
            }
          >
            Courses
          </Link>

          {user && (
            <Link
              to={getOverviewPath()}
              className={
                isActive("/admin-dashboard/overview") ||
                isActive("/trainer-dashboard/overview") ||
                isActive("/learner-dashboard/overview")
                  ? "nav-active"
                  : ""
              }
            >
              Overview
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin-dashboard"
              className={
                isActive("/admin-dashboard") ? "nav-active" : ""
              }
            >
              Admin Dashboard
            </Link>
          )}

          {isTrainer && (
            <Link
              to="/trainer-dashboard"
              className={
                isActive("/trainer-dashboard") ? "nav-active" : ""
              }
            >
              Trainer Dashboard
            </Link>
          )}

          {isLearner && (
            <Link
              to="/learner-dashboard"
              className={
                isActive("/learner-dashboard") ? "nav-active" : ""
              }
            >
              My Learning
            </Link>
          )}

          {isLearner && (
            <Link
              to="/my-certificates"
              className={
                isActive("/my-certificates") ? "nav-active" : ""
              }
            >
              Certificates
            </Link>
          )}

          <Link
            to="/articles"
            className={isActive("/articles") ? "nav-active" : ""}
          >
            Articles
          </Link>
        </nav>

        {/* AUTH / USER ACTIONS */}
        <div className="navbar-action">
          {!user ? (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          ) : (
            <div className="user-nav-group">
              {/* 🔔 NOTIFICATION ICON */}
              <button
                className="notification-btn"
                title="Notifications"
                onClick={() => navigate("/notifications")}
              >
                <FaBell size={18} />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount}
                  </span>
                )}
              </button>

              <span className="welcome-text">
                Hi, {user.name?.split(" ")[0]}
              </span>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
