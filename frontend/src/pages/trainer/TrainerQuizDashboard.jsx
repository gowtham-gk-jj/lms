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

  const ASSET_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    const fetchQuizDashboard = async () => {
      try {
        // ✅ FIXED ROUTE
        const res = await api.get("/api/quiz/trainer/quizzes");

        const quizzes =
          res.data?.quizzes ||
          res.data?.data ||
          res.data ||
          [];

        const map = new Map();

        quizzes.forEach((q) => {
          if (!q.courseId) return;

          if (!map.has(q.courseId)) {
            map.set(q.courseId, {
              _id: q.courseId,
              title: q.courseTitle,
              image:
                q.courseImage ||
                "uploads/default-course.png",
            });
          }
        });

        setCoursesWithQuizzes([...map.values()]);
      } catch (err) {
        console.error(
          "LOAD QUIZ DASHBOARD ERROR:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDashboard();
  }, [user?.token]);

  return (
    <div className="tqd-page-wrapper">
      <div className="tqd-header">
        <button
          className="tqd-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h1 className="tqd-title">
          Quiz Management
        </h1>

        <div className="tqd-header-spacer"></div>
      </div>

      <div className="tqd-content">
        {loading && (
          <p className="tqd-status">Loading...</p>
        )}

        {!loading &&
          coursesWithQuizzes.length === 0 && (
            <p className="tqd-status">
              No quizzes created yet.
            </p>
          )}

        <div className="tqd-grid">
          {coursesWithQuizzes.map((course) => (
            <div
              key={course._id}
              className="tqd-card"
            >
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
                    navigate(
                      `/trainer/course/${course._id}/quizzes`
                    )
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
