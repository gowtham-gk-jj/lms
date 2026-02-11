import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./CourseDetails.css";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  
  /* ================= LOAD COURSE ================= */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // ❌ DO NOT add /api here
        const res = await api.get(`/api/courses/public/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Course fetch error:", err.response?.data || err.message);
      }
    };

    fetchCourse();
  }, [id]);

  /* ================= LOAD ENROLLMENT ================= */
  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // ❌ DO NOT add /api here
        const res = await api.get("/api/enrollment/my-courses");

        const current = res.data.find(
          (e) => e.course?._id === id
        );

        setEnrollment(current || null);
      } catch (err) {
        console.error(
          "Enrollment fetch error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id, user]);

  /* ================= ACTIONS ================= */

  const handleEnroll = async () => {
    try {
      await api.post("/api/enrollment/enroll", {
        learnerId: user._id,
        courseId: id,
      });

      window.location.reload();
    } catch (err) {
      console.error("Enroll failed:", err.response?.data || err.message);
    }
  };

  const handleWatchLesson = (levelName) => {
    navigate(`/learn/${id}/${levelName.toLowerCase()}`);
  };

  const handleStartQuiz = (levelName) => {
    navigate(`/quiz/${id}/${levelName.toLowerCase()}`);
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!course) return <div className="error-screen">Course not found</div>;

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const completedLessons = enrollment?.completedLessons || [];
  const completedQuizzes = enrollment?.completedQuizzes || [];

  return (
  <div className="course-details-page">
    <div className="course-top">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="course-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>
    </div>

    <div className="level-grid">
      {levels.map((levelName, index) => {
        const levelId = course.levels?.[index]?._id;
        const prevLevelId =
          index > 0 ? course.levels?.[index - 1]?._id : null;

        const isEnrolled = !!enrollment;

        const unlocked =
          isEnrolled &&
          (index === 0 || completedQuizzes.includes(prevLevelId));

        const lessonDone = completedLessons.includes(levelId);
        const quizDone = completedQuizzes.includes(levelId);

        return (
          <div
            key={levelName}
            className={`level-card ${unlocked ? "active" : "locked"}`}
          >
            <div className="level-header">
              <h3>{levelName}</h3>
              {quizDone && <span className="badge">Completed</span>}
            </div>

            {!isEnrolled && index === 0 && (
              <button className="primary-btn" onClick={handleEnroll}>
                Enroll Now
              </button>
            )}

            {unlocked && (
              <>
                <button
                  className="secondary-btn"
                  onClick={() => handleWatchLesson(levelName)}
                >
                  ▶ Watch Lesson
                </button>

                {!quizDone && (
                  <button
                    className="primary-btn"
                    onClick={() => handleStartQuiz(levelName)}
                  >
                    📝 Start Quiz
                  </button>
                )}
              </>
            )}

            {!unlocked && (
              <div className="locked-overlay">
                🔒 Complete previous level
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
}
