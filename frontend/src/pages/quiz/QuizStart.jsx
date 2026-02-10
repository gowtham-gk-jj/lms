import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./QuizStart.css";

export default function QuizStart() {
  const { courseId, level } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartQuiz = async () => {
    if (!user?.token) {
      alert("Please login to start the quiz");
      navigate("/login");
      return;
    }

    try {
      const res = await api.get(
        `/quiz/play/${courseId}/${level}`
      );

      if (
        !res.data ||
        !res.data.success ||
        !Array.isArray(res.data.questions) ||
        res.data.questions.length === 0
      ) {
        throw new Error("No quiz");
      }

      navigate(`/quiz/${courseId}/${level}/play`);
    } catch (err) {
      console.error(err);
      alert("Quiz not available for this level");
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <div className="quiz-start-page">
      <div className="quiz-start-header">
        <button
          className="quiz-start-back-btn"
          onClick={() => navigate(`/course/${courseId}`)}
        >
          ← Back
        </button>
      </div>

      <div className="quiz-start-card">
        <h2 className="quiz-start-title">
          {level.toUpperCase()} Quiz
        </h2>

        <p className="quiz-start-subtitle">
          Ready to start the quiz?
        </p>

        <button className="start-btn" onClick={handleStartQuiz}>
          ▶ Start Quiz
        </button>
      </div>
    </div>
  );
}
