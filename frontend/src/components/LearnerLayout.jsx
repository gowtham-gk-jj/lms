import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import './LearnerLayout.css';

const LearnerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div className="learner-shell">
      {/* ========== TOP NAVIGATION ========== */}
      <nav className="learner-nav">
        <div className="logo" onClick={() => navigate('/learner-dashboard')}>
          🎓 <span className="logo-text">Learner App</span>
        </div>

        <div className="user-section">
          <div className="profile-info">
            {/* ✅ MODULE 5 FIX: Dynamic Name and Role */}
            <p className="name">{user?.name || "Guest"}</p>
            <p className="role">{user?.role || "Learner"}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      {/* ========== PAGE CONTENT ========== */}
      <main className="learner-main">
        <div className="content-wrapper">
          <Outlet /> {/* This renders the LearnerDashboard.jsx */}
        </div>
      </main>
    </div>
  );
};

export default LearnerLayout;