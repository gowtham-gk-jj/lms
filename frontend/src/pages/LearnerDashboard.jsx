import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./LearnerDashboardStyles.css";

export default function LearnerDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/enrollment/my-courses");
        setEnrollments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-content">Loading your courses...</div>;
  }

  return (
    <div className="learner-db-wrapper">
      <div className="dashboard-top-nav">
        <Link to="/" className="back-arrow-btn">←</Link>
        <span className="nav-label">Home Page</span>
      </div>

      <div className="dashboard-content">
        <h1>My Learning Journey</h1>

        <div className="info-box">
          You have <strong>{enrollments.length}</strong> active enrollments
        </div>

        <div className="enrollment-grid">
          {enrollments.length > 0 ? (
            enrollments.map((item) => (
              <div key={item._id} className="course-progress-card">
                <h3>{item.course?.title}</h3>

                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>

                <button
                  className="continue-btn"
                  onClick={() =>
                    navigate(`/learn/${item.course?._id}/beginner`)
                  }
                >
                  Continue Learning
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No courses enrolled yet</p>
              <button onClick={() => navigate("/")}>Browse Courses</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
