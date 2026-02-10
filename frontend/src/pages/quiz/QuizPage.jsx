import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./QuizPage.css";

export default function QuizPage() {
  const { courseId, level } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD QUIZ QUESTIONS
  ================================ */
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `/quiz/play/${courseId}/${level}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (
          !res.data ||
          !res.data.success ||
          !Array.isArray(res.data.questions) ||
          res.data.questions.length === 0
        ) {
          throw new Error("Quiz not found");
        }

        setQuestions(res.data.questions);
      } catch (err) {
        navigate(`/course/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId, level, user, navigate]);

  /* ===============================
     HANDLE ANSWER CHANGE
  ================================ */
  const handleChange = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  /* ===============================
     SUBMIT QUIZ ✅ FIXED FLOW
  ================================ */
  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions");
      return;
    }

    let score = 0;

    questions.forEach((q) => {
      const correct = q.options.find((o) => o.isCorrect)?.text;
      if (answers[q._id] === correct) score++;
    });

    const total = questions.length;

    try {
      const res = await axios.post(
        "/quiz/submit",
        {
          courseId,
          level,
          score,
          total,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // ✅ ALWAYS GO TO RESULT PAGE
      navigate(`/quiz/result/${res.data.result._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz");
    }
  };

  if (loading) return <p className="quiz-status">Loading...</p>;

  return (
    <div className="quiz-page-wrapper">
      {/* ===== HEADER ===== */}
      <div className="quiz-header">
        <button
          className="quiz-back-btn"
          onClick={() => navigate(`/course/${courseId}`)}
        >
          ← Back
        </button>
        <h1 className="quiz-title">
          {level.toUpperCase()} Quiz
        </h1>
        <div />
      </div>

      {/* ===== QUESTIONS ===== */}
      <div className="quiz-content">
        {questions.map((q, index) => (
          <div key={q._id} className="quiz-question-card">
            <div className="quiz-question">
              {index + 1}. {q.question}
            </div>

            <div className="quiz-options">
              {q.options.map((opt, i) => (
                <label key={i} className="quiz-option">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt.text}
                    checked={answers[q._id] === opt.text}
                    onChange={() =>
                      handleChange(q._id, opt.text)
                    }
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ===== SUBMIT ===== */}
      <div className="quiz-submit-wrapper">
        <button
          className="quiz-submit-btn"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}
