import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./QuizPage.css";

export default function QuizResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const token = user?.token;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseCompleted, setCourseCompleted] = useState(false);

  const quizSavedRef = useRef(false);

  /* ===============================
     LOAD QUIZ RESULT
  ================================ */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please login to view quiz result");
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await api.get(
          `/api/quiz/result/${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resultData =
          res.data?.result || res.data;

        if (!resultData) {
          setError("Result not found");
          return;
        }

        setResult(resultData);
      } catch (err) {
        console.error("Result Load Error:", err);

        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load result");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId, token, navigate]);

  /* ===============================
     SAVE QUIZ PASS → ENROLLMENT
  ================================ */
  useEffect(() => {
    if (!result?.passed || quizSavedRef.current || !token) return;

    const saveQuizPass = async () => {
      try {
        quizSavedRef.current = true;

        await api.post(
          "/api/enrollment/complete-quiz",
          { attemptId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ Quiz pass saved");
      } catch (err) {
        console.error("❌ Failed to save quiz pass", err);
      }
    };

    saveQuizPass();
  }, [result, attemptId, token]);

  /* ===============================
     CHECK COURSE COMPLETION
  ================================ */
  useEffect(() => {
    if (!result?.passed || !token) return;

    const checkCourseCompletion = async () => {
      try {
        const res = await api.get(
          "/api/enrollment/my-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const enrollments =
          res.data?.enrollments || res.data || [];

        const enrollment = enrollments.find(
          (e) => e.course?._id === result.course
        );

        if (!enrollment) return;

        const totalLevels =
          enrollment.course?.levels?.length || 0;

        const completedLevels =
          enrollment.completedLessons?.length || 0;

        if (
          completedLevels === totalLevels &&
          totalLevels > 0
        ) {
          setCourseCompleted(true);
        }
      } catch (err) {
        console.error(
          "Failed to verify course completion",
          err
        );
      }
    };

    checkCourseCompletion();
  }, [result, token]);

  /* ===============================
     UI STATES
  ================================ */
  if (loading)
    return <p className="quiz-status">Loading result...</p>;

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
        <h1 className="quiz-title">Quiz Result</h1>
        <div />
      </div>

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
          Percentage:{" "}
          <strong>{result.percentage}%</strong>
        </p>

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
            onClick={() =>
              navigate(`/quiz/review/${attemptId}`)
            }
          >
            Review Answers
          </button>

          {result.passed && (
            <button
              className="quiz-submit-btn"
              style={{ backgroundColor: "#16a34a" }}
              onClick={() =>
                navigate(`/course/${result.course}`)
              }
            >
              Go to Course
            </button>
          )}

          {courseCompleted && (
            <button
              className="quiz-submit-btn"
              style={{ backgroundColor: "#7c3aed" }}
              onClick={() =>
                navigate("/my-certificates")
              }
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
                  `/quiz/${result.course}/${result.level?.toLowerCase()}`
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
