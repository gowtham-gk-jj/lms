import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios"; 
import { useAuth } from "../../context/AuthContext";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const token = user?.token;

  /* ================= COURSE ================= */
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(
    searchParams.get("course") || ""
  );
  const [level, setLevel] = useState("Beginner");

  /* ================= SINGLE QUESTION ================= */
  const [questionType, setQuestionType] = useState("mcq");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  /* ================= QUESTIONS LIST ================= */
  const [questions, setQuestions] = useState([]);

  /* ================= BULK ================= */
  const [bulkText, setBulkText] = useState("");

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    if (!token) return;

    api
      .get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("LOAD COURSE ERROR:", err);
        alert("Failed to load courses");
      });
  }, [token]);

  /* ================= ADD SINGLE QUESTION ================= */
  const addQuestion = () => {
    if (!question.trim()) {
      alert("Enter a question");
      return;
    }

    if (questionType === "true_false") {
      if (!["True", "False"].includes(correctAnswer)) {
        alert("Select True or False");
        return;
      }

      setQuestions((prev) => [
        ...prev,
        {
          questionType: "true_false",
          question: question.trim(),
          options: ["True", "False"],
          correctAnswer,
        },
      ]);
    } else {
      if (options.some((o) => !o.trim()) || !correctAnswer) {
        alert("Fill all MCQ fields");
        return;
      }

      setQuestions((prev) => [
        ...prev,
        {
          questionType: "mcq",
          question: question.trim(),
          options,
          correctAnswer,
        },
      ]);
    }

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setQuestionType("mcq");
  };

  /* ================= DELETE QUESTION ================= */
  const deleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SAVE QUIZ (NEW API) ================= */
  const saveQuiz = async () => {
    if (!selectedCourse || questions.length === 0) {
      alert("Select course and add questions");
      return;
    }

    const levelMap = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
    };

    const formattedQuestions = questions.map((q) => {
      if (q.questionType === "true_false") {
        return {
          question: q.question,
          type: "TRUE_FALSE",
          options: [
            { text: "True", isCorrect: q.correctAnswer === "True" },
            { text: "False", isCorrect: q.correctAnswer === "False" },
          ],
        };
      }

      return {
        question: q.question,
        type: "MCQ",
        options: q.options.map((opt) => ({
          text: opt,
          isCorrect: opt === q.correctAnswer,
        })),
      };
    });

    try {
      const response = await api.post(
        "/api/quiz",
        {
          courseId: selectedCourse,
          level: levelMap[level],
          questions: formattedQuestions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201 || response.data?.success) {
        alert("Quiz saved successfully ✅");
        navigate("/trainer-dashboard");
      }
    } catch (error) {
      console.error("SAVE QUIZ ERROR:", error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Quiz creation failed"
      );
    }
  };

  /* ================= UI ================= */
  return (
    <div className="cq-page-wrapper">
      <div className="cq-header">
        <button className="cq-back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="cq-title">Create Quiz</h1>
        <div className="cq-header-spacer"></div>
      </div>

      <div className="create-quiz-page">
        <div className="quiz-meta cq-card">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {questions.length > 0 && (
          <button className="save-btn cq-save-btn" onClick={saveQuiz}>
            💾 Save Quiz
          </button>
        )}
      </div>
    </div>
  );
}
