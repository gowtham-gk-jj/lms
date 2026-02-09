import { useLocation, useNavigate } from "react-router-dom";
import "./QuizPage.css";

export default function QuizResultPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return <p className="quiz-status">No result found</p>;
  }

  const { score, total, passed } = state;

  return (
    <div className="quiz-page-wrapper">
      <div className="quiz-header">
        <button className="quiz-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="quiz-title">Quiz Result</h1>
        <div />
      </div>

      <div className="quiz-result-card">
        <h2>
          Score: {score} / {total}
        </h2>

        <h3
          style={{
            color: passed ? "green" : "red",
            marginTop: "10px",
          }}
        >
          {passed ? "✅ Passed" : "❌ Failed"}
        </h3>

        <button
          className="quiz-submit-btn"
          style={{ marginTop: "20px" }}
          onClick={() => navigate("/courses")}
        >
          Back to Courses
        </button>
      </div>
    </div>
  );
}
