import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import "./EditAllQuizQuestions.css";

const EditAllQuizQuestions = () => {
  const { courseId, level: encodedLevel } = useParams();
  const level = Number(decodeURIComponent(encodedLevel));
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH QUESTIONS ===== */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/quiz/course/${courseId}`);

        const filtered = (res.data.quiz || []).filter(
          (q) => q.level === level
        );

        // normalize options
        const formatted = filtered.map((q) => {
          const options = q.options.map((o) => o.text);
          const correct = q.options.find((o) => o.isCorrect);

          return {
            ...q,
            options,
            correctAnswer: correct ? correct.text : "",
          };
        });

        setQuestions(formatted);
      } catch (err) {
        console.error("Failed to load quiz questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId, level]);

  /* ===== UPDATE LOCAL STATE ===== */
  const updateQuestion = (index, field, value) => {
    const copy = [...questions];
    copy[index][field] = value;
    setQuestions(copy);
  };

  /* ===== SAVE ALL ===== */
  const saveAll = async () => {
    try {
      for (const q of questions) {
        const formattedOptions = q.options.map((opt) => ({
          text: opt,
          isCorrect: opt === q.correctAnswer,
        }));

        await api.put(`/quiz/question/${q._id}`, {
          question: q.question,
          options: formattedOptions,
        });
      }

      alert("All questions updated successfully ✅");
      navigate(-1);
    } catch (err) {
      console.error("Failed to save questions", err);
      alert("Failed to update questions ❌");
    }
  };

  if (loading) return <p className="eaq-status">Loading...</p>;

  return (
    <div className="eaq-page-wrapper">
      {/* ===== HEADER ===== */}
      <div className="eaq-header">
        <button
          className="eaq-back-btn"
          onClick={() => navigate(-1)}
          title="Go Back"
        >
          ←
        </button>

        <h1 className="eaq-title">
          Edit All Questions – Level {level}
        </h1>

        <button
          className="eaq-save-header-btn"
          onClick={saveAll}
          title="Save All"
        >
          💾
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="eaq-content">
        {questions.map((q, index) => (
          <div key={q._id} className="eaq-card">
            <label className="eaq-label">
              Question {index + 1}
            </label>

            <textarea
              className="eaq-input"
              value={q.question}
              onChange={(e) =>
                updateQuestion(index, "question", e.target.value)
              }
            />

            <div className="eaq-options">
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  className="eaq-input"
                  value={opt}
                  onChange={(e) => {
                    const opts = [...q.options];
                    opts[i] = e.target.value;
                    updateQuestion(index, "options", opts);
                  }}
                />
              ))}
            </div>

            <select
              className="eaq-select"
              value={q.correctAnswer}
              onChange={(e) =>
                updateQuestion(index, "correctAnswer", e.target.value)
              }
            >
              {q.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditAllQuizQuestions;
