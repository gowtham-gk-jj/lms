import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "./CourseQuizList.css";

const CourseQuizList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        // ✅ FIXED: Added /api
        const res = await api.get(`/api/quiz/course/${courseId}`);

        // Safe fallback handling
        const quizArray =
          res.data?.quiz ||
          res.data?.data ||
          res.data ||
          [];

        const levelMap = new Map();

        quizArray.forEach((q) => {
          if (!q.level) return;
          levelMap.set(
            q.level,
            (levelMap.get(q.level) || 0) + 1
          );
        });

        const formatted = [...levelMap.entries()].map(
          ([level, count]) => ({
            _id: level,
            totalQuestions: count,
          })
        );

        setLevels(formatted);
      } catch (err) {
        console.error("Quiz Level Load Error:", err);
        setError("Failed to load quiz levels");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchLevels();
    } else {
      setLoading(false);
    }
  }, [courseId, user?.token]);

  if (loading)
    return <p className="cql-status">Loading...</p>;

  if (error)
    return <p className="cql-status">{error}</p>;

  return (
    <div className="cql-page-wrapper">
      <div className="cql-header">
        <button
          className="cql-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h1 className="cql-title">
          Quiz Levels
        </h1>
        <div className="cql-header-spacer"></div>
      </div>

      <div className="cql-content">
        {levels.length === 0 ? (
          <p className="cql-status">
            No quizzes created for this course.
          </p>
        ) : (
          <div className="cql-grid">
            {levels.map((level) => (
              <div
                key={level._id}
                className="cql-card"
              >
                <div>
                  <div className="cql-level">
                    Level {level._id}
                  </div>

                  <div className="cql-badge">
                    {level.totalQuestions} Questions
                  </div>
                </div>

                <button
                  className="cql-btn"
                  onClick={() =>
                    navigate(
                      `/trainer/course/${courseId}/quiz/level/${level._id}`
                    )
                  }
                >
                  View Questions
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseQuizList;
