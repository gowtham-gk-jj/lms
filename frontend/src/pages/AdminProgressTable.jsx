import React, { useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import "./AdminProgressTable.css";

const AdminProgressTable = () => {
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No token found");
          setStats([]);
          setLoading(false);
          return;
        }

        const res = await api.get("/api/enrollment/all-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const safeData = Array.isArray(res.data)
          ? res.data
          : [];

        setStats(safeData);
      } catch (err) {
        console.error(
          "Admin Report Error:",
          err.response?.data || err.message
        );
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= FILTER ================= */
  const filteredStats = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return stats.filter((s) => {
      const learnerName =
        s.learner?.name?.toLowerCase() || "";
      const courseTitle =
        s.course?.title?.toLowerCase() || "";

      return (
        learnerName.includes(term) ||
        courseTitle.includes(term)
      );
    });
  }, [stats, searchTerm]);

  /* ================= METRICS ================= */
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

  /* ================= EXPORT CSV ================= */
  const handleExportCSV = () => {
    if (filteredStats.length === 0) {
      alert("No data to export");
      return;
    }

    const header =
      "Student Name,Email,Course,Progress %,Status\n";

    const rows = filteredStats
      .map((s) => {
        const status =
          s.progress === 100
            ? "Finished"
            : "Learning";

        // Wrap fields in quotes to avoid CSV comma issues
        return `"${s.learner?.name || ""}","${
          s.learner?.email || ""
        }","${s.course?.title || ""}","${
          s.progress || 0
        }","${status}"`;
      })
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student_progress_report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="loading-text">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="admin-progress-wrapper">
      <div className="progress-card">

        {/* ===== PAGE TITLE ===== */}
        <h1 className="page-main-title">
          Detailed Student Progress
        </h1>
        <p className="page-subtitle">
          Viewing all active course enrollments and completion percentages.
        </p>

        {/* ===== METRICS ===== */}
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

        {/* ===== HEADER SECTION ===== */}
        <div className="stats-header">
          <h2 className="table-title">
            Organization Reports
          </h2>

          <div className="header-actions">
            <input
              type="text"
              placeholder="Search student or course..."
              className="db-search-input"
              value={searchTerm}
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

        {/* ===== TABLE ===== */}
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

                    <td data-label="Student Details">
                      <div className="student-cell">
                        <span className="s-name">
                          {s.learner?.name || "N/A"}
                        </span>
                        <span className="s-email">
                          {s.learner?.email || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td data-label="Enrolled Course">
                      <span className="course-badge">
                        {s.course?.title || "N/A"}
                      </span>
                    </td>

                    <td data-label="Progress">
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

                    <td data-label="Status">
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
                  <td
                    colSpan="4"
                    className="no-results"
                  >
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
