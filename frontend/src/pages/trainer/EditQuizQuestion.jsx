import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditQuizQuestion.css";

const EditQuizQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===== FETCH QUESTION (FIXED) ===== */
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/quiz/question/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        // ✅ NORMALIZE BACKEND DATA → UI FORMAT
        const optionTexts = data.options.map((o) => o.text);
        const correctOpt = data.options.find((o) => o.isCorrect);

        setQuestion(data.question);
        setOptions(optionTexts);
        setCorrectAnswer(correctOpt ? correctOpt.text : "");
      } catch (err) {
        console.error("FETCH QUESTION ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, token]);

  /* ===== UPDATE QUESTION ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedOptions = options.map((opt) => ({
      text: opt,
      isCorrect: opt === correctAnswer,
    }));

    await fetch(
      `http://localhost:5000/api/quiz/question/${questionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
          options: formattedOptions,
        }),
      }
    );

    alert("Question updated successfully ✅");
    navigate(-1);
  };

  if (loading) return <p className="eq-status">Loading...</p>;

  return (
    <div className="eq-page-wrapper">

      {/* HEADER */}
      <div className="eq-header">
        <button
          className="eq-back-btn"
          onClick={() => navigate(-1)}
        >
          ← 
        </button>

        <h1 className="eq-title">Edit Question</h1>
        <div className="eq-header-spacer"></div>
      </div>

      {/* CONTENT */}
      <div className="eq-content">
        <div className="eq-card">
          <form onSubmit={handleSubmit}>

            <div className="eq-form-group">
              <label>Question</label>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            <div className="eq-form-group">
              <label>Options</label>
              <div className="eq-options">
                {options.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...options];
                      updated[i] = e.target.value;
                      setOptions(updated);
                    }}
                    required
                  />
                ))}
              </div>
            </div>

            <div className="eq-form-group">
              <label>Correct Answer</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                required
              >
                {options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="eq-update-btn">
              Update Question
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuizQuestion;
