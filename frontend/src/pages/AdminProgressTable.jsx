import React, { useState, useEffect } from "react";
import "./AdminProgressTable.css"; // ✅ Updated to look in the same folder
import api from "../api/axios";


const AdminProgressTable = () => {
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("enrollment/all-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Stats Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const filteredStats = stats.filter(s => 
    s.learner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-text">Loading student activity...</div>;

  return (
    <div className="admin-stats-card">
      <div className="stats-header">
        <h2 className="table-title">Live Student Progress</h2>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search student or course..." 
            className="db-search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                      <span className="s-name">{s.learner?.name || "Unknown User"}</span>
                      <span className="s-email">{s.learner?.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="course-badge">{s.course?.title || "Deleted Course"}</span>
                  </td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar-outer">
                        <div 
                          className="progress-bar-inner" 
                          style={{ width: `${s.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-num">{s.progress || 0}%</span>
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
                <td colSpan="4" className="no-results">No enrollment records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProgressTable;