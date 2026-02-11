import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./QuizPage.css";

export default function QuizReview() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const token = user?.token;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please login to view review");
      return;
    }

    const fetchReview = async () => {
      try {
        const res = await api.get(
          `/api/quiz/review/${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        if (!data?.success) {
          setError("No review data found");
          return;
        }

        setQuestions(data.questions || []);
        setAnswers(data.answers || {});
      } catch (err) {
        console.error("Review Load Error:", err);

        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load quiz review");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [attemptId, token, navigate]);

  if (loading)
    return <p className="quiz-status">Loading review...</p>;

  if (error)
    return <p className="quiz-status">{error}</p>;

  return (
    <div className="quiz-page-wrapper">
      <div className="quiz-header">
        <button
          className="quiz-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="quiz-title">Quiz Review</h1>
        <div />
      </div>

      <div className="quiz-content">
        {questions.map((q, index) => {
          const correctAnswer = q.options.find(
            (o) => o.isCorrect
          )?.text;

          const userAnswer = answers[q._id];

          return (
            <div
              key={q._id}
              className="quiz-question-card"
            >
              <div className="quiz-question">
                {index + 1}. {q.question}
              </div>

              <div className="quiz-options">
                {q.options.map((opt, i) => {
                  let statusClass = "";

                  if (opt.text === correctAnswer) {
                    statusClass = "correct";
                  } else if (opt.text === userAnswer) {
                    statusClass = "wrong";
                  }

                  return (
                    <label
                      key={i}
                      className={`quiz-option ${statusClass}`}
                    >
                      <input
                        type="radio"
                        checked={userAnswer === opt.text}
                        disabled
                        readOnly
                      />
                      <span>{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
