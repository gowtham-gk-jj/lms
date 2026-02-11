import React, { useState, useEffect } from "react";
import api from "../api/axios";

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
    setLoading(true);

    try {
      /* ================= FETCH USERS ================= */
      const resUsers = await api.get("/api/auth/users");

      const usersList = Array.isArray(resUsers.data)
        ? resUsers.data
        : resUsers.data.users ||
          resUsers.data.data ||
          [];

      const learnerList = usersList.filter((u) =>
        ["learner", "student"].includes(
          u.role?.toLowerCase()?.trim()
        )
      );

      setLearners(learnerList);

      /* ================= FETCH COURSES ================= */
      const resCourses = await api.get("/api/courses");

      const courseList = Array.isArray(resCourses.data)
        ? resCourses.data
        : resCourses.data.courses ||
          resCourses.data.data ||
          [];

      setCourses(courseList);
    } catch (err) {
      console.error("❌ Admin Enrollment Load Error:", err);
      setLearners([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const assignCourse = async (e) => {
    e.preventDefault();

    if (!selectedLearner || !selectedCourse) {
      alert("Please select both a learner and a course");
      return;
    }

    try {
      await api.post("/api/enrollment/enroll", {
        learnerId: selectedLearner,
        courseId: selectedCourse,
      });

      alert("🎉 Course assigned successfully!");
      setSelectedLearner("");
      setSelectedCourse("");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Enrollment failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="loader-box">
        Syncing Database...
      </div>
    );
  }

  return (
    <div className="assign-section">
      <h3>👤 Administrative Enrollment</h3>

      <form onSubmit={assignCourse} className="assign-form">
        <div className="form-group">
          <label>Learner</label>
          <select
            value={selectedLearner}
            onChange={(e) =>
              setSelectedLearner(e.target.value)
            }
            className="assign-select"
            required
          >
            <option value="">
              -- {learners.length} Learners Found --
            </option>
            {learners.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name} ({l.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Course to Assign</label>
          <select
            value={selectedCourse}
            onChange={(e) =>
              setSelectedCourse(e.target.value)
            }
            className="assign-select"
            required
          >
            <option value="">
              -- {courses.length} Courses Found --
            </option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-enroll">
          Confirm Enrollment
        </button>
      </form>
    </div>
  );
};

export default AssignCourseForm;
