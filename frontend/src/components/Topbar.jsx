import React from 'react';
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  // Determine title based on the user's role
  const isLearner = user?.role === "learner";
  const displayTitle = isLearner 
    ? "Learner Portal – My Progress" 
    : "Admin Portal – Organization & Settings";

  return (
    <>
      <style>{`
        .topbar {
          height: 60px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          border-bottom: 1px solid #e2e8f0;
          width: 100%;
        }
        .topbar h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #334155;
          margin: 0;
        }
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 1.2rem;
          cursor: pointer;
        }
        .user-pill {
          font-size: 0.85rem;
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 20px;
          color: #475569;
          font-weight: 500;
        }
      `}</style>

      <div className="topbar">
        <h3>{displayTitle}</h3>
        
        <div className="topbar-actions">
          <span title="Notifications">🔔</span>
          <div className="user-pill">
            👤 {user?.name?.split(' ')[0] || "User"}
          </div>
        </div>
      </div>
    </>
  );
}