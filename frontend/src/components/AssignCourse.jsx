import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "./AssignCourse.css";

const AssignCourseForm = () => {
  const [learners, setLearners] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedLearner, setSelectedLearner] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get users
      const resUsers = await api.get("/api/auth/users");

      const usersList = Array.isArray(resUsers.data)
        ? resUsers.data
        : resUsers.data.users || [];

      const learnerList = usersList.filter((u) =>
        ["learner", "student"].includes(
          u.role?.toLowerCase()?.trim()
        )
      );

      setLearners(learnerList);

      // Get courses
      const resCourses = await api.get("/api/courses");

      const courseList = Array.isArray(resCourses.data)
        ? resCourses.data
        : resCourses.data.courses || [];

      setCourses(courseList);
    } catch (err) {
      console.error("❌ Enrollment Load Error:", err);
      setLearners([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const assignCourse = async (e) => {
    e.preventDefault();

    if (!selectedLearner || !selectedCourse) {
      alert("Please select both learner and course");
      return;
    }

    try {
      await api.post("/api/enrollment/enroll", {
        learnerId: selectedLearner,
        courseId: selectedCourse,
      });

      alert("🎉 Enrollment Successful!");

      setSelectedLearner("");
      setSelectedCourse("");
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div className="assign-card">
      <h3>👤 Administrative Enrollment</h3>

      <form onSubmit={assignCourse}>
        <div className="assign-row">

          {/* Learner Dropdown */}
          <div>
            <label>Learner</label>
            <select
              value={selectedLearner}
              onChange={(e) => setSelectedLearner(e.target.value)}
              required
            >
              <option value="">
                -- {learners.length} Learners Found --
              </option>
              {learners.map((learner) => (
                <option key={learner._id} value={learner._id}>
                  {learner.name} ({learner.email})
                </option>
              ))}
            </select>
          </div>

          {/* Course Dropdown */}
          <div>
            <label>Course to Assign</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">
                -- {courses.length} Courses Found --
              </option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <div>
            <button type="submit" className="enroll-btn">
              Confirm Enrollment
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AssignCourseForm;
