import React, { useState, useEffect } from "react";
import api from "../api/axios";   // ✅ use axios instance
import "./AdminProgressTable.css";

const AdminProgressTable = () => {
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // ✅ CHANGED TO REPORTS API
        const res = await api.get("/api/reports");

        setStats(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Report Fetch Error:", err.response?.data || err.message);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // --- FILTER ---
  const filteredStats = stats.filter(s =>
    s.learner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ANALYTICS ---
  const totalEnrollments = filteredStats.length;

  const avgProgress = totalEnrollments > 0
    ? (
        filteredStats.reduce((acc, curr) => acc + (curr.progress || 0), 0)
        / totalEnrollments
      ).toFixed(1)
    : 0;

  const completedCount = filteredStats.filter(s => s.progress === 100).length;

  // --- EXPORT CSV FROM BACKEND ---
  const handleExportCSV = async () => {
    try {
      const response = await api.get("/api/reports/export", {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "admin_reports.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export Error:", err.response?.data || err.message);
    }
  };

  if (loading) return <div className="loading-text">Loading Reports...</div>;

  return (
    <div className="admin-stats-card">

      {/* ANALYTICS CARDS */}
      <div className="analytics-metrics-grid">
        <div className="metric-box">
          <h3>{totalEnrollments}</h3>
          <p>Total Enrollments</p>
        </div>

        <div className="metric-box">
          <h3>{avgProgress}%</h3>
          <p>Avg. Progress</p>
        </div>

        <div className="metric-box">
          <h3>{completedCount}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="stats-header">
        <h2 className="table-title">Organization Reports</h2>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Search student or course..."
            className="db-search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button onClick={handleExportCSV} className="export-btn">
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="progress-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
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
                      <span className="s-name">{s.learner?.name}</span>
                      <span className="s-email">{s.learner?.email}</span>
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
                          style={{ width: `${s.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-num">
                        {s.progress || 0}%
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className={`status-pill ${s.progress === 100 ? "completed" : "active"}`}>
                      {s.progress === 100 ? "Finished" : "Learning"}
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
  );
};

export default AdminProgressTable;
