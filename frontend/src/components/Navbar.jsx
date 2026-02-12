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

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const role = user?.role;
  const isAdmin = role === "admin";
  const isTrainer = role === "trainer" || role === "instructor";
  const isLearner = role === "learner" || role === "student";

  const getOverviewPath = () => {
    if (isAdmin) return "/admin-dashboard/overview";
    if (isTrainer) return "/trainer-dashboard/overview";
    if (isLearner) return "/learner-dashboard/overview";
    return "/";
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const res = await api.get("/api/notifications");
        const unread = Array.isArray(res.data)
          ? res.data.filter((n) => !n.isRead)
          : [];
        setUnreadCount(unread.length);
      } catch {
        console.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">

        {/* LEFT SECTION */}
        <div className="navbar-left">
          <div className="navbar-logo">
            <Link to="/">LMS</Link>
          </div>

          <div
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Courses
          </Link>

          {user && (
            <Link to={getOverviewPath()} onClick={() => setMenuOpen(false)}>
              Overview
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>
              Admin Dashboard
            </Link>
          )}

          {isTrainer && (
            <Link to="/trainer-dashboard" onClick={() => setMenuOpen(false)}>
              Trainer Dashboard
            </Link>
          )}

          {isLearner && (
            <Link to="/learner-dashboard" onClick={() => setMenuOpen(false)}>
              My Learning
            </Link>
          )}

          {isLearner && (
            <Link to="/my-certificates" onClick={() => setMenuOpen(false)}>
              Certificates
            </Link>
          )}

          <Link to="/articles" onClick={() => setMenuOpen(false)}>
            Articles
          </Link>
        </nav>

        {/* RIGHT SECTION */}
        <div className="navbar-action">
          {!user ? (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          ) : (
            <div className="user-nav-group">
              <button
                className="notification-btn"
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

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
