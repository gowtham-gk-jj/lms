import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
      {/* ========== SIDEBAR ========== */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="brand-badge">A</div>
          <div>
            <h1 className="brand-name">LMS ADMIN</h1>
            <p className="user-welcome">Hello, {user?.name}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {/* HOME */}
            <li>
              <NavLink to="/" className="nav-link">
                🌐 Go to Home
              </NavLink>
            </li>

            {/* DASHBOARD */}
            <li>
              <NavLink
                to="/admin-dashboard"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
              >
                🏠 Dashboard Home
              </NavLink>
            </li>

            {/* USERS */}
            <li>
              <NavLink
                to="/admin-dashboard/users"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
              >
                👥 User Directory
              </NavLink>

            </li>

            {/* REGISTER USER */}
            <li>
              <NavLink
                to="/admin-dashboard/users/create"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
              >
                ➕ Register User
              </NavLink>
            </li>

            {/* CREATE ARTICLE */}
            <li>
              <NavLink
                to="/admin-dashboard/articles/create"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
              >
                📝 Create Article
              </NavLink>
            </li>

            {/* ENROLL LEARNER */}
            <li>
              <NavLink
                to="/admin-dashboard/enroll"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
              >
                🎓 Enroll Learner
              </NavLink>
            </li>

            {/* LEARNER PROGRESS */}
            <li>
              <NavLink
                to="/admin-dashboard/progress"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
              >
                📊 Learner Progress
              </NavLink>
            </li>

            {/* 📑 REPORTS (NEW) */}
            <li>
              <NavLink
                to="/admin-dashboard/reports"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
              >
                📑 Reports
              </NavLink>
            </li>

            {/* ORGANIZATION SETTINGS */}
            <li>
              <NavLink
                to="/admin-dashboard/organization"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active-nav" : ""}`
                }
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
        <header className="admin-header">
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
