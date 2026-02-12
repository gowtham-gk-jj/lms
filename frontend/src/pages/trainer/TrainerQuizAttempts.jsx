import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./TrainerQuizAttempts.css";

export default function TrainerQuizAttempts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) return;

    const fetchAttempts = async () => {
      try {
        const res = await api.get("/api/quiz/trainer/attempts");

        if (!res.data?.success) {
          setError("No quiz attempts found");
          return;
        }

        setAttempts(res.data.attempts || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [user]);

  if (loading) {
    return (
      <p className="attempts-status">
        Loading practice quiz results...
      </p>
    );
  }

  if (error) {
    return <p className="attempts-status">{error}</p>;
  }

  return (
    <div className="trainer-attempts-page">
      {/* ===== HEADER ===== */}
      <div className="trainer-attempts-header">
        <button
          className="attempts-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h1 className="attempts-title">
          Practice Quiz Results
        </h1>

        <div />
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="attempts-card">
        <table className="trainer-attempts-table">
          <thead>
            <tr>
              <th>User</th>
              <th>User Email</th>
              <th>Course</th>
              <th>Level</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {attempts.map((a) => (
              <tr key={a.attemptId}>
                <td data-label="User">
                  {a.userName || "N/A"}
                </td>

                <td data-label="Email" className="mono">
                  {a.userEmail || "N/A"}
                </td>

                <td data-label="Course">
                  {a.courseTitle || "N/A"}
                </td>

                <td data-label="Level">
                  {a.level}
                </td>

                <td data-label="Score">
                  {a.score} / {a.totalQuestions}
                </td>

                <td data-label="Percentage">
                  {a.percentage}%
                </td>

                <td data-label="Status">
                  <span
                    className={`status-badge ${
                      a.passed ? "pass" : "fail"
                    }`}
                  >
                    {a.passed ? "PASS" : "FAIL"}
                  </span>
                </td>

                <td data-label="Date">
                  {a.date
                    ? new Date(a.date).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
