import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Standardized path
import './TrainerLayout.css';

const TrainerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="trainer-container">
      {/* ========== TRAINER NAVBAR ========== */}
      <nav className="trainer-nav">
        <div className="trainer-logo" onClick={() => navigate('/trainer-dashboard')}>
          👨‍🏫 <span className="logo-text">Trainer Panel</span>
        </div>

        <div className="trainer-profile-area">
          <div className="trainer-user-info">
            <span className="trainer-name">{user?.name || "Instructor"}</span>
            <span className="trainer-tag">{user?.role || "Instructor"}</span>
          </div>
          <button onClick={handleLogout} className="trainer-logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* ========== MAIN CONTENT ========== */}
      <main className="trainer-main-content">
        <div className="trainer-content-wrapper">
           <Outlet /> {/* This renders the Trainer specific pages */}
        </div>
      </main>
    </div>
  );
};

export default TrainerLayout;