import React from "react";
import { useNavigate } from "react-router-dom";
import AssignCourseForm from "../components/AssignCourse";
import { useAuth } from "../context/AuthContext";

const AdminEnrollment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "admin") return <h1>Unauthorized</h1>;

  return (
    <div className="db-wrapper">
      <div style={{ padding: "20px" }}>
        <button onClick={() => navigate(-1)} className="back-btn">← Back to Dashboard</button>
        <header className="db-welcome">
          <h1>Course Enrollment</h1>
          <p>Select a Learner and a Course to create a new enrollment.</p>
        </header>
        
        <div className="enroll-form-card">
          <AssignCourseForm />
        </div>
      </div>
    </div>
  );
};

export default AdminEnrollment;