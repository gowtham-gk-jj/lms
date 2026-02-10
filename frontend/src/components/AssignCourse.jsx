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
      /* ================= FETCH LEARNERS ================= */
      const resUsers = await api.get("/auth/users");

      const allUsers = Array.isArray(resUsers.data)
        ? resUsers.data
        : resUsers.data.users || [];

      setLearners(
        allUsers.filter((u) =>
          ["learner", "student"].includes(
            u.role?.toLowerCase().trim()
          )
        )
      );

      /* ================= FETCH COURSES ================= */
      const resCourses = await api.get("/courses");

      const actualCourses = Array.isArray(resCourses.data)
        ? resCourses.data
        : resCourses.data.courses || [];

      setCourses(actualCourses);
    } catch (err) {
      console.error("Fetch Error:", err);
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
      await api.post("/enrollment/enroll", {
        learnerId: selectedLearner,
        courseId: selectedCourse,
      });

      alert("🎉 Success! Course assigned.");
      setSelectedLearner("");
      setSelectedCourse("");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Server error. Please try again."
      );
    }
  };

  if (loading)
    return <div className="loader-box">Syncing Database...</div>;

  return (
    <div className="assign-section">
      <h3>👤 Administrative Enrollment</h3>

      <form onSubmit={assignCourse} className="assign-form">
        <div className="form-group">
          <label>Learner</label>
          <select
            value={selectedLearner}
            onChange={(e) => setSelectedLearner(e.target.value)}
            className="assign-select"
            required
          >
            <option value="">
              -- {learners.length} Learners Found --
            </option>
            {learners.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Course to Assign</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
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
