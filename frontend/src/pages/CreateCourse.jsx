import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./CreateCourse.css";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [syllabus, setSyllabus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    if (image) data.append("image", image);
    if (syllabus) data.append("syllabus", syllabus);

    try {
      // ✅ FIXED: use api instance (auto baseURL + token)
      await api.post("/api/courses", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Course Created Successfully!");
      navigate("/trainer-dashboard");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-wrapper">
      <button
        type="button"
        className="round-back-btn"
        onClick={() => navigate("/trainer-dashboard")}
        title="Back to Dashboard"
      >
        ←
      </button>

      <div className="create-course-card">
        <div className="card-header">
          <h2>➕ Create New Course</h2>
          <p>Fill in the details below to launch your course</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter a catchy title..."
            />
          </div>

          <div className="form-group">
            <label>Course Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what students will learn..."
            />
          </div>

          <div className="form-group">
            <label>Course Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Course Syllabus (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSyllabus(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
