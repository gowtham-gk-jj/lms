import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./CourseDetails.css";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD COURSE
  ================================ */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/public/${id}`
        );
        setCourse(res.data);
      } catch (err) {
        console.error("Course fetch error", err);
      }
    };
    fetchCourse();
  }, [id]);

  /* ===============================
     LOAD ENROLLMENT
  ================================ */
  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/enrollment/my-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const current = res.data.find(
          (e) => e.course._id === id
        );

        setEnrollment(current || null);
      } catch (err) {
        console.error("Enrollment fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id, token]);

  /* ===============================
     ACTIONS
  ================================ */
  const handleEnroll = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/enrollment/enroll",
        {
          learnerId: user._id,
          courseId: id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (err) {
      console.error("Enroll failed", err);
    }
  };

  const handleWatchLesson = (levelName) => {
    navigate(`/learn/${id}/${levelName.toLowerCase()}`);
  };

  const handleStartQuiz = (levelName) => {
    navigate(`/quiz/${id}/${levelName.toLowerCase()}`);
  };

  /* ===============================
     LOADING GUARD
  ================================ */
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!course) {
    return <div className="error-screen">Course not found</div>;
  }

  const levels = ["Beginner", "Intermediate", "Advanced"];

  // 🔑 PROGRESS SOURCES
  const completedLessons =
    enrollment?.completedLessons || [];
  const completedQuizzes =
    enrollment?.completedQuizzes || [];

  return (
    <div className="course-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-desc">{course.description}</p>
      </div>

      <div className="level-grid">
        {levels.map((levelName, index) => {
          const levelId = course.levels[index]?._id;
          const prevLevelId =
            index > 0
              ? course.levels[index - 1]?._id
              : null;

          const isEnrolled = !!enrollment;

          // 🔓 LEVEL UNLOCK — ONLY BY QUIZ PASS
          const unlocked =
            isEnrolled &&
            (index === 0 ||
              completedQuizzes.includes(prevLevelId));

          const lessonDone =
            completedLessons.includes(levelId);
          const quizDone =
            completedQuizzes.includes(levelId);

          return (
            <div key={levelName} className="level-card">
              <div className="level-info">
                <span className="level-badge">
                  Step {index + 1}
                </span>
                <h3>{levelName}</h3>
              </div>

              <div className="level-actions">
                {index === 0 && !isEnrolled && (
                  <button
                    className="enroll-btn"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </button>
                )}

                {unlocked && (
                  <button
                    className="video-btn"
                    onClick={() =>
                      handleWatchLesson(levelName)
                    }
                  >
                    ▶ Watch Lesson
                  </button>
                )}

                {unlocked && lessonDone && !quizDone && (
                  <button
                    className="video-btn quiz-start-btn"
                    onClick={() =>
                      handleStartQuiz(levelName)
                    }
                  >
                    ▶ Start Quiz
                  </button>
                )}

                {quizDone && (
                  <button
                    className="quiz-btn completed"
                    disabled
                  >
                    Quiz Passed ✅
                  </button>
                )}

                {unlocked && !lessonDone && (
                  <button className="enroll-btn" disabled>
                    Complete video to unlock quiz 🔒
                  </button>
                )}

                {!unlocked && index !== 0 && (
                  <button className="enroll-btn" disabled>
                    Complete previous level 🔒
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
