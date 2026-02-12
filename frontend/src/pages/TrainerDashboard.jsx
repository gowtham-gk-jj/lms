import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./TrainerDashboard.css";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const ASSET_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= FETCH COURSES ================= */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user) {
          navigate("/", { replace: true });
          return;
        }

        const res = await api.get("/api/courses");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.courses || [];

        setCourses(data);
      } catch (err) {
        console.error(
          "Error fetching courses:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate, user]);

  /* ================= DELETE COURSE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?"))
      return;

    try {
      await api.delete(`/api/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(
        "Delete failed:",
        err.response?.data || err.message
      );
      alert("Delete failed. You might not have permission.");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="trainer-dashboard">

      {/* ===== MOBILE HEADER ===== */}
      <div className="trainer-mobile-header">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        <h2 className="trainer-title">Trainer Panel</h2>

        <div style={{ width: "30px" }}></div>
      </div>

      {/* ===== OVERLAY ===== */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`trainer-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="trainer-sidebar-top">
          <h2>Trainer Panel</h2>

          <button
            className="sidebar-btn"
            onClick={() => {
              navigate("/trainer-dashboard/overview");
              setMenuOpen(false);
            }}
          >
            📊 Overview
          </button>

          <button
            className="sidebar-btn active"
            onClick={() => {
              navigate("/trainer-dashboard");
              setMenuOpen(false);
            }}
          >
            📚 My Courses
          </button>

          <button
            className="sidebar-btn"
            onClick={() => {
              navigate("/trainer/quizzes");
              setMenuOpen(false);
            }}
          >
            📝 View Quizzes
          </button>

          <button
            className="sidebar-btn"
            onClick={() => {
              navigate("/trainer/quiz-attempts");
              setMenuOpen(false);
            }}
          >
            📊 Practice Quiz Results
          </button>

          <button
            className="sidebar-btn"
            onClick={() => {
              navigate("/trainer/create-quiz");
              setMenuOpen(false);
            }}
          >
            ➕ Create Quiz
          </button>

          <button
            className="sidebar-btn"
            onClick={() => {
              navigate("/trainer/create-course");
              setMenuOpen(false);
            }}
          >
            ➕ Create Course
          </button>

          <button
            className="sidebar-btn"
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
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

        <h2 style={{ marginBottom: "20px" }}>
          Course Management
        </h2>

        {loading ? (
          <div className="loader-box">
            Loading courses...
          </div>
        ) : (
          <div className="course-grid">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="course-card">
                  <img
                    src={
                      course.image
                        ? `${ASSET_URL}/${course.image}`
                        : "https://via.placeholder.com/300x180?text=No+Image"
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
                        onClick={() =>
                          handleDelete(course._id)
                        }
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
                  onClick={() =>
                    navigate("/trainer/create-course")
                  }
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
