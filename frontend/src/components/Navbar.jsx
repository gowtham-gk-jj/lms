import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔔 UNREAD COUNT STATE
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ MOBILE MENU STATE (ADDED)
  const [menuOpen, setMenuOpen] = useState(false);

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
        const res = await api.get("/api/notifications");

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

        {/* ✅ MOBILE MENU TOGGLE BUTTON (ADDED) */}
        <div
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* LINKS */}
        <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={
              isActive("/") && !isAdmin && !isTrainer
                ? "nav-active"
                : ""
            }
            onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
            >
              Certificates
            </Link>
          )}

          <Link
            to="/articles"
            className={isActive("/articles") ? "nav-active" : ""}
            onClick={() => setMenuOpen(false)}
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
