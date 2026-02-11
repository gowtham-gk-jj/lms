import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Home.css";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Backend base URL for images (NO /api here)
  const ASSET_URL = import.meta.env.VITE_API_BASE_URL;

  /* ===============================
     FETCH PUBLIC COURSES
  ================================ */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // ⚠ DO NOT include /api here if axios baseURL already has it
        const res = await api.get("/api/courses/public");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.courses || [];

        setCourses(data);
      } catch (err) {
        console.error(
          "Error fetching courses:",
          err.response?.data || err.message
        );
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <div className="hero">
        <h1>
          Learning <span>Management</span> System
        </h1>
        <p>Empowering Education. Anytime. Anywhere.</p>
      </div>

      <h2 className="section-title">🔥 Popular Courses</h2>

      {loading ? (
        <div className="loading-container">
          <p>Discovering the best courses for you...</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.length > 0 ? (
            courses.map((course) => {
              const imagePath = course.image
                ? course.image.replace(/\\/g, "/")
                : null;

              const syllabusPath = course.syllabus
                ? course.syllabus.replace(/\\/g, "/")
                : null;

              return (
                <div key={course._id} className="course-card">
                  {/* COURSE IMAGE */}
                  <img
                    src={
                      imagePath
                        ? `${ASSET_URL}/${imagePath}`
                        : "/api/course-placeholder.png"
                    }
                    alt={course.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/course-placeholder.png";
                    }}
                  />

                  {/* COURSE BODY */}
                  <div className="course-body">
                    <h3>{course.title}</h3>
                    <p>
                      {course.description
                        ? `${course.description.substring(0, 100)}...`
                        : "No description available."}
                    </p>

                    <div className="course-actions">
                      {/* SYLLABUS BUTTON */}
                      {syllabusPath && (
                        <a
                          href={`${ASSET_URL}/${syllabusPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="syllabus-btn"
                        >
                          Syllabus
                        </a>
                      )}

                      {/* KNOW MORE BUTTON */}
                      <button
                        type="button"
                        className="know-btn"
                        onClick={() =>
                          navigate(`/api/course/${course._id}`)
                        }
                      >
                        Know More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-courses">
              No courses available at the moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
