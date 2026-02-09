import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LearningPage.css";

export default function LearningPage() {
  const { courseId, level } = useParams();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState(null);
  const [activeLevel, setActiveLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = "http://localhost:5000";

  /* ===============================
     LOAD ENROLLMENT DATA
  ================================ */
  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${API_URL}/api/enrollment/my-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const currentEnrollment = res.data.find(
          (e) => e.course._id === courseId
        );

        if (!currentEnrollment) {
          setEnrollment(null);
          setLoading(false);
          return;
        }

        const levels = currentEnrollment.course.levels;

        const levelIndex = levels.findIndex(
          (l) => l.name.toLowerCase() === level.toLowerCase()
        );

        const completedCount =
          currentEnrollment.completedLessons?.length || 0;

        setActiveLevel(
          levelIndex >= 0 ? levelIndex : completedCount
        );

        setEnrollment(currentEnrollment);
      } catch (err) {
        console.error("Error loading classroom:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId, level]);

  /* ===============================
     MARK LEVEL AS COMPLETED
  ================================ */
  const handleMarkComplete = async () => {
    if (!enrollment || submitting) return;

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      const levelId =
        enrollment.course.levels[activeLevel]._id;

      // 🚫 Prevent double completion
      if (enrollment.completedLessons?.includes(levelId)) {
        alert("✅ This level is already completed.");
        return;
      }

      const res = await axios.patch(
        `${API_URL}/api/enrollment/update-progress`,
        {
          enrollmentId: enrollment._id,
          levelId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEnrollment(res.data.enrollment);
      alert("✅ Level completed successfully!");
    } catch (err) {
      console.error(
        "Progress Update Error:",
        err.response?.data || err
      );
      alert("❌ Failed to complete this level.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     UI STATES
  ================================ */
  if (loading) {
    return <div className="loading-screen">Entering Classroom...</div>;
  }

  if (!enrollment) {
    return (
      <div className="error-screen">
        Access Denied or Course Not Found.
      </div>
    );
  }

  const currentLevel = enrollment.course.levels[activeLevel];
  const unlockedIndex =
    enrollment.completedLessons?.length || 0;

  /* ===============================
     VIDEO RENDER
  ================================ */
  const renderVideo = () => {
    if (!currentLevel?.videoUrl) {
      return (
        <div className="no-video-placeholder">
          No video available for this level.
        </div>
      );
    }

    const url = currentLevel.videoUrl;
    const isYouTube =
      url.includes("youtube.com") || url.includes("youtu.be");

    if (isYouTube) {
      let videoId = "";

      if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1];
      }

      return (
        <iframe
          title="Lesson Video"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
          width="100%"
          height="100%"
        />
      );
    }

    return (
      <video controls className="main-video-player">
        <source src={url} type="video/mp4" />
      </video>
    );
  };

  return (
    <div className="learning-container">
      {/* ===== SIDEBAR ===== */}
      <div className="lesson-sidebar">
        <div className="sidebar-top-nav">
          <Link to="/learner-dashboard" className="back-arrow-btn">
            ←
          </Link>
          <span className="nav-label">Course Content</span>
        </div>

        <div className="sidebar-header">
          <h3>{enrollment.course.title}</h3>

          <div className="sidebar-progress-box">
            <div className="progress-label">
              Completion: {enrollment.progress || 0}%
            </div>

            <div className="sidebar-pb-bg">
              <div
                className="sidebar-pb-fill"
                style={{
                  width: `${enrollment.progress || 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        <ul className="level-list">
          {enrollment.course.levels.map((lvl, index) => {
            const isUnlocked = index <= unlockedIndex;
            const isActive = index === activeLevel;

            return (
              <li
                key={lvl._id}
                className={
                  isActive
                    ? "active-level"
                    : isUnlocked
                    ? "unlocked-level"
                    : "locked-level"
                }
                onClick={() =>
                  isUnlocked &&
                  navigate(
                    `/learn/${courseId}/${lvl.name.toLowerCase()}`
                  )
                }
              >
                {lvl.name} {!isUnlocked && " 🔒"}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="video-main-content">
        {/* ✅ BACK TO COURSE LEVELS SHORTCUT */}
        <button
          className="back-to-levels-btn"
          onClick={() => navigate(`/course/${courseId}`)}
        >
          ← Back to Course Levels
        </button>

        <div className="content-header">
          <h2>{currentLevel.name}</h2>
        </div>

        <div className="video-player-wrapper">
          {renderVideo()}
        </div>

        <div className="lesson-controls">
          <button
            className="complete-btn"
            onClick={handleMarkComplete}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Mark as Completed"}
          </button>
        </div>
      </div>
    </div>
  );
}
