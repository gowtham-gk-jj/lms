import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(
    searchParams.get("course") || ""
  );
  const [level, setLevel] = useState("Beginner");

  const [questionType, setQuestionType] = useState("mcq");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [questions, setQuestions] = useState([]);
  const [bulkText, setBulkText] = useState("");

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    if (!user?.token) return;

    api
      .get("/api/courses") // ✅ FIXED
      .then((res) =>
        setCourses(Array.isArray(res.data) ? res.data : [])
      )
      .catch(() => alert("Failed to load courses"));
  }, [user?.token]);

  /* ================= ADD QUESTION ================= */
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

  /* ================= SAVE QUIZ ================= */
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
      const res = await api.post("/api/quiz", { // ✅ FIXED
        courseId: selectedCourse,
        level: levelMap[level],
        questions: formattedQuestions,
      });

      if (res.status === 201 || res.data?.success) {
        alert("Quiz saved successfully ✅");
        navigate("/trainer-dashboard");
      } else {
        alert("Quiz creation failed");
      }
    } catch (err) {
      console.error("SAVE QUIZ ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Quiz creation failed");
    }
  };

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
      </div>
    </div>
  );
}
