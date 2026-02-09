import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./QuizPage.css";

export default function QuizResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseCompleted, setCourseCompleted] = useState(false);

  // ✅ prevent duplicate API calls
  const quizSavedRef = useRef(false);

  /* ===============================
     LOAD QUIZ RESULT
  ================================ */
  useEffect(() => {
    if (!user?.token) return;

    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quiz/result/${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!res.data.success) {
          setError("Result not found");
          return;
        }

        setResult(res.data.result);
      } catch (err) {
        setError("Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId, user]);

  /* ===============================
     SAVE QUIZ PASS → ENROLLMENT
  ================================ */
  useEffect(() => {
    if (
      !result ||
      !result.passed ||
      quizSavedRef.current ||
      !user?.token
    ) {
      return;
    }

    const saveQuizPass = async () => {
      try {
        quizSavedRef.current = true;

        await axios.post(
          "http://localhost:5000/api/enrollment/complete-quiz",
          {
            courseId: result.course,
            level: result.level, // Beginner / Intermediate / Advanced
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        console.log("✅ Quiz pass saved to enrollment");
      } catch (err) {
        console.error("❌ Failed to save quiz pass", err);
      }
    };

    saveQuizPass();
  }, [result, user]);

  /* ===============================
     CHECK COURSE COMPLETION
  ================================ */
  useEffect(() => {
    if (!result?.passed || !user?.token) return;

    const checkCourseCompletion = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/enrollment/my-courses",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const enrollment = res.data.find(
          (e) => e.course._id === result.course
        );

        if (!enrollment) return;

        const totalLevels = enrollment.course.levels.length;
        const completedLevels =
          enrollment.completedLessons?.length || 0;

        if (completedLevels === totalLevels) {
          setCourseCompleted(true);
        }
      } catch (err) {
        console.error("Failed to verify course completion", err);
      }
    };

    checkCourseCompletion();
  }, [result, user]);

  /* ===============================
     UI STATES
  ================================ */
  if (loading) return <p className="quiz-status">Loading result...</p>;
  if (error) return <p className="quiz-status">{error}</p>;

  return (
    <div className="quiz-page-wrapper">
      {/* ===== HEADER ===== */}
      <div className="quiz-header">
        <button className="quiz-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="quiz-title">Quiz Result</h1>
        <div />
      </div>

      {/* ===== RESULT CARD ===== */}
      <div className="quiz-result-card">
        <h2>
          Score: {result.score} / {result.totalQuestions}
        </h2>

        <h3
          style={{
            marginTop: "10px",
            color: result.passed ? "green" : "red",
          }}
        >
          {result.passed ? "✅ Passed" : "❌ Failed"}
        </h3>

        <p style={{ marginTop: "8px" }}>
          Percentage: <strong>{result.percentage}%</strong>
        </p>

        {/* ===== ACTION BUTTONS ===== */}
        <div
          style={{
            marginTop: "25px",
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* REVIEW */}
          <button
            className="quiz-submit-btn"
            onClick={() => navigate(`/quiz/review/${attemptId}`)}
          >
            Review Answers
          </button>

          {/* PASSED → COURSE */}
          {result.passed && (
            <button
              className="quiz-submit-btn"
              style={{ backgroundColor: "#16a34a" }}
              onClick={() => navigate(`/course/${result.course}`)}
            >
              Go to Course
            </button>
          )}

          {/* 🎓 COURSE COMPLETED → CERTIFICATE */}
          {courseCompleted && (
            <button
              className="quiz-submit-btn"
              style={{ backgroundColor: "#7c3aed" }}
              onClick={() => navigate("/my-certificates")}
            >
              🎓 View Course Certificate
            </button>
          )}

          {/* FAILED → RETRY */}
          {!result.passed && (
            <button
              className="quiz-submit-btn"
              style={{ backgroundColor: "#2563eb" }}
              onClick={() =>
                navigate(
                  `/quiz/${result.course}/${result.level.toLowerCase()}`
                )
              }
            >
              Retry Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
