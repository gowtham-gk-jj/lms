import React from "react";
import AssignCourseForm from "../components/AssignCourse";
import { useAuth } from "../context/AuthContext";
import "./AdminEnrollment.css";

const AdminEnrollment = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") return <h1>Unauthorized</h1>;

  return (
    <div className="admin-enrollment-wrapper">
      <div className="admin-enrollment-content">
        
        {/* Page Header */}
        <div className="admin-enrollment-header">
          <h1>Course Enrollment</h1>
          <p>
            Select a Learner and a Course to create a new enrollment.
          </p>
        </div>

        {/* Form Card */}
        <div className="admin-enrollment-card">
          <AssignCourseForm />
        </div>

      </div>
    </div>
  );
};

export default AdminEnrollment;
