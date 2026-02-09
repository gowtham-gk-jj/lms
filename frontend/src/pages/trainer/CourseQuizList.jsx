import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./CourseQuizList.css";

const CourseQuizList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/quiz/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch quiz data");

        const data = await res.json();

        /**
         * Backend returns:
         * { success: true, quiz: [ { level, ... } ] }
         *
         * We group by level here
         */
        const levelMap = new Map();

        (data.quiz || []).forEach((q) => {
          if (!levelMap.has(q.level)) {
            levelMap.set(q.level, 1);
          } else {
            levelMap.set(q.level, levelMap.get(q.level) + 1);
          }
        });

        const formatted = [...levelMap.entries()].map(
          ([level, count]) => ({
            _id: level,
            totalQuestions: count,
          })
        );

        setLevels(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz levels");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchLevels();
  }, [courseId, token]);

  if (loading) return <p className="cql-status">Loading...</p>;
  if (error) return <p className="cql-status">{error}</p>;

  return (
    <div className="cql-page-wrapper">

      {/* HEADER */}
      <div className="cql-header">
        <button
          className="cql-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <h1 className="cql-title">Quiz Levels</h1>

        <div className="cql-header-spacer"></div>
      </div>

      {/* CONTENT */}
      <div className="cql-content">
        {levels.length === 0 ? (
          <p className="cql-status">
            No quizzes created for this course.
          </p>
        ) : (
          <div className="cql-grid">
            {levels.map((level) => (
              <div key={level._id} className="cql-card">
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
