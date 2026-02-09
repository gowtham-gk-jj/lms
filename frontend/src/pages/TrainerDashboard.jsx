import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TrainerDashboard.css";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = user?.token;

  /* ===============================
     FETCH COURSES
  ================================ */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const res = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate, token]);

  /* ===============================
     DELETE COURSE
  ================================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Delete failed. You might not have permission.");
    }
  };

  /* ===============================
     LOGOUT
  ================================ */
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="trainer-dashboard">
      {/* ===== SIDEBAR ===== */}
      <aside className="trainer-sidebar">
        <div className="trainer-sidebar-top">
          <h2>Trainer Panel</h2>

          {/* 🔥 OVERVIEW */}
          <button
            className="sidebar-btn"
            onClick={() => navigate("/trainer-dashboard/overview")}
          >
            📊 Overview
          </button>

          <button
            className="sidebar-btn active"
            onClick={() => navigate("/trainer-dashboard")}
          >
            📚 My Courses
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/trainer/quizzes")}
          >
            📝 View Quizzes
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/trainer/quiz-attempts")}
          >
            📊 Practice Quiz Results
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/trainer/create-quiz")}
          >
            ➕ Create Quiz
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/trainer/create-course")}
          >
            ➕ Create Course
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/")}
          >
            🌐 View Site
          </button>
        </div>

        <div className="trainer-sidebar-bottom">
          <button
            className="sidebar-btn logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="trainer-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || "Trainer"}</h1>
          <p>Manage your curriculum, quizzes, and student progress.</p>
        </div>

        <h2 style={{ marginBottom: "20px" }}>Course Management</h2>

        {loading ? (
          <div className="loader-box">Loading courses...</div>
        ) : (
          <div className="course-grid">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="course-card">
                  <img
                    src={
                      course.image?.startsWith("http")
                        ? course.image
                        : `http://localhost:5000/${course.image}`
                    }
                    alt={course.title}
                    className="course-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x180?text=No+Image";
                    }}
                  />

                  <div className="course-body">
                    <h3>{course.title}</h3>
                    <p className="course-desc">
                      {course.description?.substring(0, 80)}...
                    </p>

                    <div className="course-actions">
                      <button
                        className="btn-add"
                        onClick={() =>
                          navigate(`/trainer/add-level/${course._id}`)
                        }
                      >
                        Levels
                      </button>

                      <button
                        className="btn-edit"
                        onClick={() =>
                          navigate(`/trainer/edit-course/${course._id}`)
                        }
                      >
                        ✏️
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(course._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-text">
                <p>No courses found.</p>
                <button
                  className="btn-add"
                  onClick={() => navigate("/trainer/create-course")}
                >
                  Create First Course
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
