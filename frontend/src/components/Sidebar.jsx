import React from 'react';

// Added 'user' to props to handle Module 5 roles
export default function Sidebar({ active, setActive, user }) {
  const isLearner = user?.role === "learner";

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          padding: 20px;
          position: sticky;
          top: 0;
        }
        .sidebar h2 {
          font-size: 1.1rem;
          color: #1e293b;
          margin-bottom: 25px;
          padding-left: 10px;
          border-left: 4px solid #22c55e; /* Green for Learner focus */
        }
        .sidebar-btn {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 6px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sidebar-btn:hover {
          background: #f1f5f9;
          color: #22c55e;
        }
        .sidebar-btn.active {
          background: #22c55e;
          color: #ffffff;
        }
      `}</style>

      <div className="sidebar">
        <h2>{isLearner ? "Student Portal" : "Admin Portal"}</h2>

        {isLearner ? (
          /* MODULE 5: Learner Links */
          <>
            <button className={active === "courses" ? "sidebar-btn active" : "sidebar-btn"} onClick={() => setActive("courses")}>
              📖 My Courses
            </button>
            <button className={active === "articles" ? "sidebar-btn active" : "sidebar-btn"} onClick={() => setActive("articles")}>
              📝 Articles
            </button>
            <button className={active === "profile" ? "sidebar-btn active" : "sidebar-btn"} onClick={() => setActive("profile")}>
              👤 My Profile
            </button>
          </>
        ) : (
          /* Admin Links */
          <>
            <button className={active === "org" ? "sidebar-btn active" : "sidebar-btn"} onClick={() => setActive("org")}>
              🏢 Organization
            </button>
            <button className={active === "brand" ? "sidebar-btn active" : "sidebar-btn"} onClick={() => setActive("brand")}>
              🎨 Branding
            </button>
            <button className={active === "rules" ? "sidebar-btn active" : "sidebar-btn"} onClick={() => setActive("rules")}>
              📜 Rules
            </button>
          </>
        )}
      </div>
    </>
  );
}