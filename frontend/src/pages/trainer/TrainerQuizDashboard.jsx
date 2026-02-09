import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./TrainerQuizDashboard.css";

export default function TrainerQuizDashboard() {
  const { user } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();

  const [coursesWithQuizzes, setCoursesWithQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    axios
      // ✅ CORRECT API
      .get("http://localhost:5000/api/quiz/trainer/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const quizzes = res.data.quizzes || [];

        /**
         * Backend gives flat list:
         * [{ courseId, courseTitle, level, questionCount }]
         *
         * We convert it to unique courses for this page
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
      })
      .catch((err) => {
        console.error("LOAD QUIZ DASHBOARD ERROR:", err);
      })
      .finally(() => setLoading(false));
  }, [token]);

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
                src={`http://localhost:5000/${course.image}`}
                alt={course.title}
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
