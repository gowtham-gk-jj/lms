import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./AddLevel.css";

export default function AddLevel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [level, setLevel] = useState("Beginner");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple YouTube validation
    if (
      !videoUrl.includes("youtube.com") &&
      !videoUrl.includes("youtu.be")
    ) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);

    try {
      if (!user?.token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      // ✅ FIXED: use api instance + correct route
      await api.post(`/api/courses/${id}/levels`, {
        level,
        videoUrl,
      });

      alert("Level added successfully ✅");

      // ✅ FIXED ROUTE
      navigate("/trainer-dashboard");

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add level ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-level-page">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back to Dashboard
      </button>

      <form
        className="add-level-card"
        onSubmit={handleSubmit}
      >
        <div className="form-header">
          <h2>Add Course Content</h2>
          <p>Choose the difficulty and provide the video lesson.</p>
        </div>

        <div className="form-group">
          <label>Difficulty Level</label>
          <select
            value={level}
            onChange={(e) =>
              setLevel(e.target.value)
            }
          >
            <option value="Beginner">
              Beginner
            </option>
            <option value="Intermediate">
              Intermediate
            </option>
            <option value="Advanced">
              Advanced
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>YouTube Video Lesson URL</label>
          <input
            type="url"
            required
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(e.target.value)
            }
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <small className="helper-text">
            Example: https://youtu.be/dQw4w9WgXcQ
          </small>
        </div>

        <button
          type="submit"
          className="submit-level-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : "Publish Level"}
        </button>
      </form>
    </div>
  );
}
