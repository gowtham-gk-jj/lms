import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { getMyCourses } from "../api/enrollmentApi";
import "./LearnerDashboard.css";

export default function LearnerDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getMyCourses();
        setEnrollments(response.data || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
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
      {/* ✅ NEW: TOP NAVIGATION WITH BACK ARROW */}
      <div className="dashboard-top-nav">
        <Link to="/" className="back-arrow-btn" title="Back to Home">
          <span>←</span>
        </Link>
        <span className="nav-label">Home Page</span>
      </div>

      <div className="dashboard-content">
        <h1>My Learning Journey</h1>
        
        <div className="info-box">
          Welcome back! You have <strong>{enrollments.length}</strong> active enrollments.
        </div>

        <div className="enrollment-grid">
          {enrollments.length > 0 ? (
            enrollments.map((item) => (
              <div key={item._id} className="course-progress-card">
                <h3 className="course-name">{item.course?.title || "Untitled Course"}</h3>
                
                <div className="progress-section">
                  <div className="progress-text">
                    <span>Course Progress</span>
                    <span>{item.progress || 0}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${item.progress || 0}%` }} 
                    />
                  </div>
                </div>

                <button 
                  className="continue-btn"
                  onClick={() => navigate(`/learn/${item.course?._id}/beginner`)}
                >
                  Continue Learning
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No courses enrolled yet.</p>
              <button className="browse-btn" onClick={() => navigate('/')}>
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}