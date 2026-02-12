import React, { useState, useEffect } from "react";
import api from "../api/axios"; // ✅ Use axios instance
import "./AdminProgressTable.css";

const AdminProgressTable = () => {
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ CHANGED API ENDPOINT FOR LEARNER DASHBOARD
        const res = await api.get("/api/enrollment/my-stats");

        setStats(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Stats Error:", err.response?.data || err.message);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- ANALYTICS CALCULATIONS ---
  const filteredStats = stats.filter(s => 
    s.learner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEnrollments = filteredStats.length;

  const avgProgress = totalEnrollments > 0 
    ? (
        filteredStats.reduce((acc, curr) => acc + (curr.progress || 0), 0) /
        totalEnrollments
      ).toFixed(1)
    : 0;

  const completedCount = filteredStats.filter(s => s.progress === 100).length;

  // --- EXPORT CSV ---
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "LMS PROGRESS REPORT\n";
    csvContent += `Total Courses,${totalEnrollments},Avg Completion,${avgProgress}%\n\n`;
    csvContent += "Course,Progress %,Status\n";

    filteredStats.forEach(s => {
      const status = s.progress === 100 ? "Finished" : "Learning";
      csvContent += `${s.course?.title},${s.progress || 0},${status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "learner_progress_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading-text">Loading Dashboard...</div>;

  return (
    <div className="admin-stats-card">

      {/* ANALYTICS CARDS */}
      <div className="analytics-metrics-grid">
        <div className="metric-box">
          <h3>{totalEnrollments}</h3>
          <p>Total Courses</p>
        </div>

        <div className="metric-box">
          <h3>{avgProgress}%</h3>
          <p>Average Progress</p>
        </div>

        <div className="metric-box">
          <h3>{completedCount}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="stats-header">
        <h2 className="table-title">My Learning Progress</h2>

        <div className="header-actions">
          <input 
            type="text"
            placeholder="Search course..."
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
                    <span className="course-badge">
                      {s.course?.title || "Deleted Course"}
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
                <td colSpan="3" className="no-results">
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
