import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
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

    axios
      .get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch(() => alert("Failed to load courses"));
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

  /* ================= BULK UPLOAD ================= */
  const addBulkQuestions = () => {
    if (!bulkText.trim()) {
      alert("Paste questions first");
      return;
    }

    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed = [];
    let qText = "";
    let opts = [];
    let ans = "";

    const flush = () => {
      if (!qText || !ans) return;

      if (opts.length === 2) {
        parsed.push({
          questionType: "true_false",
          question: qText,
          options: ["True", "False"],
          correctAnswer: ans === "A" ? "True" : "False",
        });
      } else if (opts.length === 4) {
        const idx = ["A", "B", "C", "D"].indexOf(ans);
        if (idx !== -1) {
          parsed.push({
            questionType: "mcq",
            question: qText,
            options: opts,
            correctAnswer: opts[idx],
          });
        }
      }

      qText = "";
      opts = [];
      ans = "";
    };

    lines.forEach((line) => {
      if (/^\d+\./.test(line)) {
        flush();
        qText = line.replace(/^\d+\.\s*/, "");
        return;
      }

      if (/^A\)/i.test(line)) opts.push(line.slice(2).trim());
      if (/^B\)/i.test(line)) opts.push(line.slice(2).trim());
      if (/^C\)/i.test(line)) opts.push(line.slice(2).trim());
      if (/^D\)/i.test(line)) opts.push(line.slice(2).trim());

      if (/^answer:/i.test(line)) {
        ans = line.replace(/answer:/i, "").trim().toUpperCase();
      }
    });

    flush();

    if (!parsed.length) {
      alert("No valid questions detected");
      return;
    }

    setQuestions((prev) => [...prev, ...parsed]);
    setBulkText("");
  };

  /* ================= DELETE QUESTION ================= */
  const deleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SAVE QUIZ ================= */
  const saveQuiz = async () => {
    if (!selectedCourse || questions.length === 0) {
      alert("Select course and add questions");
      return;
    }

    // 🔑 LEVEL FIX (IMPORTANT)
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
      const res = await axios.post(
        "http://localhost:5000/api/quiz",
        {
          courseId: selectedCourse,
          level: levelMap[level], // ✅ FIXED
          questions: formattedQuestions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
        {/* COURSE + LEVEL */}
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

        {/* SINGLE QUESTION */}
        <div className="single-question-card cq-card">
          <h3>Add Single Question</h3>

          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="mcq">MCQ</option>
            <option value="true_false">True / False</option>
          </select>

          <textarea
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {questionType === "mcq" && (
            <>
              <div className="cq-options">
                {options.map((o, i) => (
                  <input
                    key={i}
                    placeholder={`Option ${i + 1}`}
                    value={o}
                    onChange={(e) => {
                      const copy = [...options];
                      copy[i] = e.target.value;
                      setOptions(copy);
                    }}
                  />
                ))}
              </div>

              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              >
                <option value="">Correct Answer</option>
                {options.map((o, i) => (
                  <option key={i} value={o}>
                    {o || `Option ${i + 1}`}
                  </option>
                ))}
              </select>
            </>
          )}

          {questionType === "true_false" && (
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            >
              <option value="">Correct Answer</option>
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          )}

          <button onClick={addQuestion} className="cq-btn-primary">
            ➕ Add Question
          </button>
        </div>

        {/* BULK */}
        <div className="cq-card">
          <h3>⚡ Bulk Question Upload</h3>
          <textarea
            rows="10"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Paste numbered questions here..."
          />
          <button onClick={addBulkQuestions} className="cq-btn-secondary">
            ⚡ Add Bulk Questions
          </button>
        </div>

        {/* PREVIEW */}
        <h3>Added Questions ({questions.length})</h3>

        {questions.map((q, i) => (
          <div key={i} className="question-card cq-preview">
            <b>{i + 1}. {q.question}</b>
            <p>{q.questionType === "true_false" ? "True / False" : "MCQ"}</p>
            <p>✅ {q.correctAnswer}</p>
            <button onClick={() => deleteQuestion(i)}>Delete</button>
          </div>
        ))}

        {questions.length > 0 && (
          <button className="save-btn cq-save-btn" onClick={saveQuiz}>
            💾 Save Quiz
          </button>
        )}
      </div>
    </div>
  );
}
