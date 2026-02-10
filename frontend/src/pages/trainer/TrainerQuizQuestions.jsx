import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "./TrainerQuizQuestions.css";

const TrainerQuizQuestions = () => {
  const { courseId, level: encodedLevel } = useParams();
  const level = Number(decodeURIComponent(encodedLevel));
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===== FETCH QUESTIONS ===== */
  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/quiz/course/${courseId}`);

      const filtered = (res.data.quiz || []).filter(
        (q) => q.level === level
      );

      setQuestions(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchQuestions();
  }, [courseId, level, user]);

  /* ===== DELETE SINGLE QUESTION ===== */
  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await api.delete(`/quiz/question/${id}`);

      // update UI instantly
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete question");
    }
  };

  /* ===== DELETE ALL QUESTIONS ===== */
  const deleteAllQuestions = async () => {
    if (!window.confirm("Delete ALL questions in this level?")) return;

    try {
      await api.delete(`/quiz/course/${courseId}/level/${level}`);

      // clear UI
      setQuestions([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete all questions");
    }
  };

  if (loading) return <p className="tqq-status">Loading...</p>;
  if (error) return <p className="tqq-status">{error}</p>;

  return (
    <div className="tqq-page-wrapper">
      {/* ===== HEADER ===== */}
      <div className="tqq-header">
        <button
          className="tqq-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <h1 className="tqq-title">
          Level {level} – Questions
        </h1>

        <div className="tqq-header-actions">
          <button
            className="tqq-edit-all-btn"
            onClick={() =>
              navigate(`/trainer/edit-questions/${courseId}/${level}`)
            }
          >
            ✏️ Edit All
          </button>

          <button
            className="tqq-delete-all-btn"
            onClick={deleteAllQuestions}
          >
            🗑️ Delete All
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="tqq-content">
        {questions.length === 0 ? (
          <p className="tqq-status">
            No questions created for this level.
          </p>
        ) : (
          questions.map((q, index) => (
            <div key={q._id} className="tqq-card">
              <div className="tqq-card-top">
                <strong>
                  {index + 1}. {q.question}
                </strong>

                <div className="tqq-actions">
                  <button
                    className="tqq-edit-btn"
                    onClick={() =>
                      navigate(`/trainer/edit-question/${q._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="tqq-delete-btn"
                    onClick={() => deleteQuestion(q._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <ul className="tqq-options">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={
                      opt.isCorrect
                        ? "tqq-option correct"
                        : "tqq-option"
                    }
                  >
                    {opt.text}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerQuizQuestions;
