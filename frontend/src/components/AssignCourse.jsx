import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import "./AssignCourse.css";

const AssignCourseForm = () => {
  const [learners, setLearners] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedLearner, setSelectedLearner] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      /* ===== USERS ===== */
      const resUsers = await api.get("/api/auth/users");

      const usersList =
        resUsers?.data?.users ||
        resUsers?.data ||
        [];

      const learnerList = Array.isArray(usersList)
        ? usersList.filter((u) =>
            ["learner", "student"].includes(
              u?.role?.toLowerCase()?.trim()
            )
          )
        : [];

      setLearners(learnerList);

      /* ===== COURSES ===== */
      const resCourses = await api.get("/api/courses");

      const courseList =
        resCourses?.data?.courses ||
        resCourses?.data ||
        [];

      setCourses(Array.isArray(courseList) ? courseList : []);

    } catch (err) {
      console.error("Enrollment Load Error:", err);
      setLearners([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= ASSIGN COURSE ================= */
  const assignCourse = async (e) => {
    e.preventDefault();

    if (!selectedLearner || !selectedCourse) {
      alert("Please select both learner and course");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/api/enrollment/enroll", {
        learnerId: selectedLearner,
        courseId: selectedCourse,
      });

      alert("🎉 Enrollment Successful!");

      setSelectedLearner("");
      setSelectedCourse("");

    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Enrollment failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        Loading learners and courses...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="assign-card">
      <h3>👤 Administrative Enrollment</h3>

      <form onSubmit={assignCourse}>
        <div className="assign-row">

          {/* ===== Learner Dropdown ===== */}
          <div className="assign-field">
            <label>Learner</label>
            <select
              value={selectedLearner}
              onChange={(e) =>
                setSelectedLearner(e.target.value)
              }
              required
            >
              <option value="">
                -- {learners.length} Learners Found --
              </option>

              {learners.map((learner) => (
                <option
                  key={learner._id}
                  value={learner._id}
                >
                  {learner.name} ({learner.email})
                </option>
              ))}
            </select>
          </div>

          {/* ===== Course Dropdown ===== */}
          <div className="assign-field">
            <label>Course to Assign</label>
            <select
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(e.target.value)
              }
              required
            >
              <option value="">
                -- {courses.length} Courses Found --
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* ===== Button ===== */}
          <div className="assign-field">
            <button
              type="submit"
              className="enroll-btn"
              disabled={submitting}
            >
              {submitting
                ? "Processing..."
                : "Confirm Enrollment"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AssignCourseForm;
