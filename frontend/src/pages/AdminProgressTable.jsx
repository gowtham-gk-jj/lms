import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "./AdminProgressTable.css";

const AdminProgressTable = () => {
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // 🔥 FIXED ENDPOINT
        const res = await api.get("/api/reports/admin");

        setStats(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(
          "Report Fetch Error:",
          err.response?.data || err.message
        );
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredStats = stats.filter(
    (s) =>
      s.learner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEnrollments = filteredStats.length;

  const avgProgress =
    totalEnrollments > 0
      ? (
          filteredStats.reduce(
            (acc, curr) => acc + (curr.progress || 0),
            0
          ) / totalEnrollments
        ).toFixed(1)
      : 0;

  const completedCount = filteredStats.filter(
    (s) => s.progress === 100
  ).length;

  const handleExportCSV = async () => {
    try {
      await api.get("/api/reports/export", {
        responseType: "blob",
      });
    } catch (err) {
      console.error(
        "Export Error:",
        err.response?.data || err.message
      );
    }
  };

  if (loading)
    return <div className="loading-text">Loading Reports...</div>;

  return (
    <div className="admin-progress-wrapper">
      <div className="progress-card">

        <h1 className="page-main-title">
          Detailed Student Progress
        </h1>
        <p className="page-subtitle">
          Viewing all active course enrollments and completion percentages.
        </p>

        <div className="analytics-metrics-grid">
          <div className="metric-box">
            <h3>{totalEnrollments}</h3>
            <p>TOTAL ENROLLMENTS</p>
          </div>

          <div className="metric-box">
            <h3>{avgProgress}%</h3>
            <p>AVG. PROGRESS</p>
          </div>

          <div className="metric-box">
            <h3>{completedCount}</h3>
            <p>COMPLETED</p>
          </div>
        </div>

        <div className="stats-header">
          <h2 className="table-title">
            Organization Reports
          </h2>

          <div className="header-actions">
            <input
              type="text"
              placeholder="Search student or course..."
              className="db-search-input"
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            <button
              onClick={handleExportCSV}
              className="export-btn"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Enrolled Course</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStats.length > 0 ? (
                filteredStats.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="student-cell">
                        <span className="s-name">
                          {s.learner?.name}
                        </span>
                        <span className="s-email">
                          {s.learner?.email}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="course-badge">
                        {s.course?.title}
                      </span>
                    </td>

                    <td>
                      <div className="progress-container">
                        <div className="progress-bar-outer">
                          <div
                            className="progress-bar-inner"
                            style={{
                              width: `${s.progress || 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="progress-num">
                          {s.progress || 0}%
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          s.progress === 100
                            ? "completed"
                            : "active"
                        }`}
                      >
                        {s.progress === 100
                          ? "Finished"
                          : "Learning"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminProgressTable;
