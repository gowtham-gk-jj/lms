import React from "react";
import courses from "../data/courses";
import { Link } from "react-router-dom";
import "./Courses.css"; // Ensure this matches the CSS file name

export default function Courses() {
  return (
    <div className="courses-section">
      <div className="section-header">
        <h2 className="section-title">🔴 Live Classes + Placement Guidance</h2>
        <p className="section-subtitle">Choose a path and start your journey with expert mentors.</p>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>

            <div className="btn-row">
              <a
                href={course.syllabusPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="syllabus-btn"
              >
                Syllabus
              </a>

              <Link to={`/course/${course.id}`} className="know-btn">
                Know More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}