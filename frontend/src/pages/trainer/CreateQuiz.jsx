import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [level, setLevel] = useState("Beginner");

  const [questionType, setQuestionType] = useState("MCQ");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [questions, setQuestions] = useState([]);

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, [user]);

  /* ================= ADD QUESTION ================= */
  const addQuestion = () => {
    if (!question.trim()) return alert("Enter question");

    if (questionType === "MCQ") {
      if (options.some((o) => !o.trim()))
        return alert("Fill all 4 options");

      if (!correctAnswer)
        return alert("Select correct answer");
    }

    const newQuestion = {
      question,
      type: questionType,
      options:
        questionType === "MCQ"
          ? options.map((opt) => ({
              text: opt,
              isCorrect: opt === correctAnswer,
            }))
          : [
              { text: "True", isCorrect: correctAnswer === "True" },
              { text: "False", isCorrect: correctAnswer === "False" },
            ],
    };

    setQuestions([...questions, newQuestion]);

    // Reset
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  /* ================= DELETE QUESTION ================= */
  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  /* ================= SAVE QUIZ ================= */
  const saveQuiz = async () => {
    if (!selectedCourse) return alert("Select course");
    if (questions.length === 0)
      return alert("Add at least one question");

    const levelMap = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
    };

    try {
      await api.post("/quiz", {
        courseId: selectedCourse,
        level: levelMap[level],
        questions,
      });

      alert("Quiz Created Successfully ✅");
      navigate("/trainer-dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="create-quiz-wrapper">

      <h2>Create Quiz</h2>

      {/* ================= COURSE & LEVEL ================= */}
      <div className="quiz-top">
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

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {/* ================= QUESTION SECTION ================= */}
      <div className="question-card">

        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option value="MCQ">MCQ</option>
          <option value="TRUE_FALSE">True / False</option>
        </select>

        <input
          type="text"
          placeholder="Enter Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {questionType === "MCQ" && (
          <>
            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[i] = e.target.value;
                  setOptions(newOptions);
                }}
              />
            ))}

            <select
              value={correctAnswer}
              onChange={(e) =>
                setCorrectAnswer(e.target.value)
              }
            >
              <option value="">Select Correct Answer</option>
              {options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </>
        )}

        {questionType === "TRUE_FALSE" && (
          <select
            value={correctAnswer}
            onChange={(e) =>
              setCorrectAnswer(e.target.value)
            }
          >
            <option value="">Select Answer</option>
            <option>True</option>
            <option>False</option>
          </select>
        )}

        <button onClick={addQuestion}>
          Add Question
        </button>
      </div>

      {/* ================= QUESTION LIST ================= */}
      <div className="question-list">
        {questions.map((q, index) => (
          <div key={index} className="question-preview">
            <strong>
              {index + 1}. {q.question}
            </strong>

            <ul>
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  style={{
                    color: opt.isCorrect
                      ? "green"
                      : "black",
                  }}
                >
                  {opt.text}
                </li>
              ))}
            </ul>

            <button
              onClick={() => deleteQuestion(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button className="save-btn" onClick={saveQuiz}>
        Save Quiz
      </button>
    </div>
  );
}
