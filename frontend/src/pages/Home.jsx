import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Home.css";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ASSET_URL = import.meta.env.VITE_ASSET_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // ✅ DO NOT include /api here if baseURL already has it
        const res = await api.get("/courses/public");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.courses || [];

        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="home-page">
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
                  <img
                    src={
                      imagePath
                        ? `${ASSET_URL}/${imagePath}`
                        : "/course-placeholder.png"
                    }
                    alt={course.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/course-placeholder.png";
                    }}
                  />

                  <div className="course-body">
                    <h3>{course.title}</h3>
                    <p>{course.description?.substring(0, 100)}...</p>

                    <div className="course-actions">
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

                      <button
                        type="button"
                        className="know-btn"
                        onClick={() =>
                          navigate(`/course/${course._id}`)
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
