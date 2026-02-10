import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
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

  // ✅ Prevent duplicate save
  const quizSavedRef = useRef(false);

  /* ===============================
     LOAD QUIZ RESULT
  ================================ */
  useEffect(() => {
    if (!user?.token) return;

    const fetchResult = async () => {
      try {
        const res = await api.get(`/quiz/result/${attemptId}`);

        if (!res.data?.success) {
          setError("Result not found");
          return;
        }

        setResult(res.data.result);
      } catch (err) {
        console.error(err);
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
    if (!result || !result.passed || quizSavedRef.current) return;

    const saveQuizPass = async () => {
      try {
        quizSavedRef.current = true;

        await api.post("/enrollment/complete-quiz", {
          attemptId,
        });

        console.log("✅ Quiz pass saved to enrollment");
      } catch (err) {
        console.error("❌ Failed to save quiz pass", err);
      }
    };

    saveQuizPass();
  }, [result, attemptId]);

  /* ===============================
     CHECK COURSE COMPLETION
  ================================ */
  useEffect(() => {
    if (!result?.passed) return;

    const checkCourseCompletion = async () => {
      try {
        const res = await api.get("/enrollment/my-courses");

        const enrollment = res.data.find(
          (e) => e.course?._id === result.course
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
  }, [result]);

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
          <button
            className="quiz-submit-btn"
            onClick={() => navigate(`/quiz/review/${attemptId}`)}
          >
            Review Answers
          </button>

          {result.passed && (
            <button
              className="quiz-submit-btn"
              style={{ backgroundColor: "#16a34a" }}
              onClick={() => navigate(`/course/${result.course}`)}
            >
              Go to Course
            </button>
          )}

          {courseCompleted && (
            <button
              className="quiz-submit-btn"
              style={{ backgroundColor: "#7c3aed" }}
              onClick={() => navigate("/my-certificates")}
            >
              🎓 View Course Certificate
            </button>
          )}

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
