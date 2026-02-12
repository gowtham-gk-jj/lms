import React from "react";
import { useNavigate } from "react-router-dom";
import AdminProgressTable from "./AdminProgressTable";
import "./AdminProgressPage.css";

const AdminProgressPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-progress-page">

      {/* ===== TOP HEADER ===== */}
      <div className="admin-progress-header">
        <button
          className="progress-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back to Dashboard
        </button>

        <div className="progress-header-text">
          <h1>Detailed Student Progress</h1>
          <p>
            Viewing all active course enrollments and completion percentages.
          </p>
        </div>
      </div>

      {/* ===== TABLE SECTION ===== */}
      <div className="progress-table-wrapper">
        <AdminProgressTable />
      </div>

    </div>
  );
};

export default AdminProgressPage;
