import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // ✅ MOBILE SIDEBAR STATE (ADDED)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔐 Safety: only Admin allowed
  if (user?.role?.toLowerCase() !== "admin") {
    return (
      <div className="admin-layout">
        <h2 style={{ padding: "2rem" }}>Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* ✅ MOBILE OVERLAY (ADDED) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ========== SIDEBAR ========== */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-badge">A</div>
          <div>
            <h1 className="brand-name">LMS ADMIN</h1>
            <p className="user-welcome">Hello, {user?.name}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li>
              <NavLink to="/" className="nav-link" onClick={() => setSidebarOpen(false)}>
                🌐 Go to Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                🏠 Dashboard Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/users"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                👥 User Directory
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/users/create"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                ➕ Register User
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/articles/create"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                📝 Create Article
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/enroll"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                🎓 Enroll Learner
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/progress"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                📊 Learner Progress
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/organization"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                ⚙ Organization Settings
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="admin-main">
        {/* ✅ MOBILE HEADER WITH TOGGLE BUTTON */}
        <header className="admin-header">
          <button
            className="mobile-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h2 className="page-title">Admin Management</h2>
        </header>

        <section className="admin-page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
