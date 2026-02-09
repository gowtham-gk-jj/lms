import React, { useState, useEffect } from "react";

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
    const token = localStorage.getItem("token");
    setLoading(true);
    
    try {
      // 1. FETCH LEARNERS
      const resUsers = await fetch("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await resUsers.json();
      const allUsers = Array.isArray(usersData) ? usersData : (usersData.users || []);
      setLearners(allUsers.filter(u => ['learner', 'student'].includes(u.role?.toLowerCase().trim())));

      // 2. FETCH ALL COURSES
      const resCourses = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const coursesData = await resCourses.json();
      
      // Ensure we handle different possible data structures
      const actualCourses = Array.isArray(coursesData) ? coursesData : (coursesData.courses || []);
      setCourses(actualCourses);

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const assignCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!selectedLearner || !selectedCourse) {
      alert("Please select both a learner and a course");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/enrollment/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ learnerId: selectedLearner, courseId: selectedCourse })
      });

      if (response.ok) {
        alert("🎉 Success! Course assigned.");
        setSelectedLearner("");
        setSelectedCourse("");
      } else {
        const data = await response.json();
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  if (loading) return <div className="loader-box">Syncing Database...</div>;

  return (
    <div className="assign-section">
      <h3>👤 Administrative Enrollment</h3>
      <form onSubmit={assignCourse} className="assign-form">
        <div className="form-group">
          <label>Learner</label>
          <select value={selectedLearner} onChange={(e) => setSelectedLearner(e.target.value)} className="assign-select" required>
            <option value="">-- {learners.length} Learners Found --</option>
            {learners.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Course to Assign</label>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="assign-select" required>
            <option value="">-- {courses.length} Courses Found --</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>

        <button type="submit" className="btn-enroll">Confirm Enrollment</button>
      </form>
    </div>
  );
};

export default AssignCourseForm;