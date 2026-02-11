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

  const [mode, setMode] = useState("single"); // single | bulk

  const [questionType, setQuestionType] = useState("MCQ");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [questions, setQuestions] = useState([]);

  const [bulkText, setBulkText] = useState("");

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch course error:", err);
      }
    };

    fetchCourses();
  }, [user]);

  /* ================= ADD SINGLE QUESTION ================= */
  const addQuestion = () => {
    if (!question.trim()) return alert("Enter question");

    let newQuestion;

    if (questionType === "MCQ") {
      if (options.some((o) => !o.trim()))
        return alert("Fill all 4 options");

      if (!correctAnswer)
        return alert("Select correct answer");

      newQuestion = {
        question: question.trim(),
        type: "MCQ",
        options: options.map((opt) => ({
          text: opt,
          isCorrect: opt === correctAnswer,
        })),
      };
    } else {
      if (!correctAnswer)
        return alert("Select True or False");

      newQuestion = {
        question: question.trim(),
        type: "TRUE_FALSE",
        options: [
          { text: "True", isCorrect: correctAnswer === "True" },
          { text: "False", isCorrect: correctAnswer === "False" },
        ],
      };
    }

    setQuestions([...questions, newQuestion]);

    // Reset fields
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  /* ================= BULK UPLOAD ================= */
  const handleBulkUpload = () => {
    if (!bulkText.trim()) return alert("Paste questions first");

    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean);

    const parsed = [];
    let qText = "";
    let opts = [];
    let ans = "";

    const flush = () => {
      if (!qText || !ans) return;

      if (opts.length === 4) {
        const index = ["A","B","C","D"].indexOf(ans);
        if (index !== -1) {
          parsed.push({
            question: qText,
            type: "MCQ",
            options: opts.map((opt,i)=>({
              text: opt,
              isCorrect: i === index
            }))
          });
        }
      }

      qText = "";
      opts = [];
      ans = "";
    };

    lines.forEach(line=>{
      if (/^\d+\./.test(line)) {
        flush();
        qText = line.replace(/^\d+\.\s*/,"");
        return;
      }

      if (/^A\)/i.test(line)) opts.push(line.slice(2).trim());
      if (/^B\)/i.test(line)) opts.push(line.slice(2).trim());
      if (/^C\)/i.test(line)) opts.push(line.slice(2).trim());
      if (/^D\)/i.test(line)) opts.push(line.slice(2).trim());

      if (/^Answer:/i.test(line)) {
        ans = line.replace(/Answer:/i,"").trim().toUpperCase();
      }
    });

    flush();

    if (!parsed.length) return alert("No valid questions found");

    setQuestions(prev=>[...prev,...parsed]);
    setBulkText("");
    alert(`${parsed.length} questions added ✅`);
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

      {/* MODE SWITCH */}
      <div className="mode-switch">
        <button
          className={mode==="single"?"active":""}
          onClick={()=>setMode("single")}
        >
          Single
        </button>
        <button
          className={mode==="bulk"?"active":""}
          onClick={()=>setMode("bulk")}
        >
          Bulk
        </button>
      </div>

      {/* SINGLE MODE */}
      {mode==="single" && (
      <div className="question-card">

        <select
          value={questionType}
          onChange={(e)=>setQuestionType(e.target.value)}
        >
          <option value="MCQ">MCQ</option>
          <option value="TRUE_FALSE">True / False</option>
        </select>

        <input
          type="text"
          placeholder="Enter Question"
          value={question}
          onChange={(e)=>setQuestion(e.target.value)}
        />

        {questionType==="MCQ" && (
          <>
            {options.map((opt,i)=>(
              <input
                key={i}
                type="text"
                placeholder={`Option ${i+1}`}
                value={opt}
                onChange={(e)=>{
                  const newOptions=[...options];
                  newOptions[i]=e.target.value;
                  setOptions(newOptions);
                }}
              />
            ))}

            <select
              value={correctAnswer}
              onChange={(e)=>setCorrectAnswer(e.target.value)}
            >
              <option value="">Select Correct Answer</option>
              {options.map((opt,i)=>(
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </>
        )}

        {questionType==="TRUE_FALSE" && (
          <select
            value={correctAnswer}
            onChange={(e)=>setCorrectAnswer(e.target.value)}
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
      )}

      {/* BULK MODE */}
      {mode==="bulk" && (
        <div className="bulk-card">
          <textarea
            rows="12"
            placeholder="Paste bulk questions here..."
            value={bulkText}
            onChange={(e)=>setBulkText(e.target.value)}
          />
          <button onClick={handleBulkUpload}>
            Add All Questions
          </button>
        </div>
      )}

      {/* PREVIEW */}
      <div className="question-list">
        {questions.map((q,index)=>(
          <div key={index} className="question-preview">
            <strong>{index+1}. {q.question}</strong>
            <ul>
              {q.options.map((opt,i)=>(
                <li
                  key={i}
                  style={{color: opt.isCorrect?"green":"black"}}
                >
                  {opt.text}
                </li>
              ))}
            </ul>
            <button onClick={()=>deleteQuestion(index)}>
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
