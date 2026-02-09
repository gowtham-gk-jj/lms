import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define base URL for assets to keep the JSX clean
  const ASSET_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${ASSET_URL}/api/courses/public`);
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
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
            courses.map((course) => (
              <div key={course._id} className="course-card">
                <img
                  src={`${ASSET_URL}/${course.image}`}
                  alt={course.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x170?text=Course+Image";
                  }}
                />

                <div className="course-body">
                  <h3>{course.title}</h3>
                  <p>{course.description.substring(0, 100)}...</p>

                  <div className="course-actions">
                    <a
                      href={`${ASSET_URL}/${course.syllabus}`}
                      target="_blank"
                      rel="noreferrer"
                      className="syllabus-btn"
                    >
                      Syllabus
                    </a>

                    <button
                      type="button"
                      className="know-btn"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      Know More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-courses">No courses available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
}