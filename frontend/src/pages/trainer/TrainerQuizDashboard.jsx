import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./TrainerQuizDashboard.css";

export default function TrainerQuizDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [coursesWithQuizzes, setCoursesWithQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ asset base (render / local)
  const ASSET_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user?.token) return;

    const fetchQuizDashboard = async () => {
      try {
        const res = await api.get("/quiz/trainer/quizzes");

        const quizzes = res.data?.quizzes || [];

        /**
         * Backend returns flat list:
         * [{ courseId, courseTitle, level, questionCount }]
         *
         * Convert to unique course cards
         */
        const map = new Map();

        quizzes.forEach((q) => {
          if (!map.has(q.courseId)) {
            map.set(q.courseId, {
              _id: q.courseId,
              title: q.courseTitle,
              image: q.courseImage || "uploads/default-course.png",
            });
          }
        });

        setCoursesWithQuizzes([...map.values()]);
      } catch (err) {
        console.error("LOAD QUIZ DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDashboard();
  }, [user]);

  return (
    <div className="tqd-page-wrapper">

      {/* HEADER */}
      <div className="tqd-header">
        <button
          className="tqd-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <h1 className="tqd-title">Quiz Management</h1>

        <div className="tqd-header-spacer"></div>
      </div>

      {/* CONTENT */}
      <div className="tqd-content">
        {loading && <p className="tqd-status">Loading...</p>}

        {!loading && coursesWithQuizzes.length === 0 && (
          <p className="tqd-status">No quizzes created yet.</p>
        )}

        <div className="tqd-grid">
          {coursesWithQuizzes.map((course) => (
            <div key={course._id} className="tqd-card">
              <img
                src={`${ASSET_URL}/${course.image}`}
                alt={course.title}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x180?text=No+Image";
                }}
              />

              <div className="tqd-card-body">
                <h3>{course.title}</h3>

                <button
                  onClick={() =>
                    navigate(`/trainer/course/${course._id}/quizzes`)
                  }
                >
                  View Levels
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
