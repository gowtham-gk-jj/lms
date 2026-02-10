import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./CreateCourse.css"; 

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '' 
  });

  const [image, setImage] = useState(null);

  // 🔥 ADD: syllabus PDF state
  const [syllabus, setSyllabus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);

    if (image) {
      data.append('image', image);
    }

    // 🔥 ADD: append syllabus PDF
    if (syllabus) {
      data.append('syllabus', syllabus);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/courses', data, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        }
      });

      alert("Success! Course Created.");
      navigate('/trainer-dashboard');

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating course");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="create-course-wrapper">
      {/* 🔹 FIXED GREEN ROUND ARROW IN TOP-LEFT */}
      <button 
        type="button"
        className="round-back-btn" 
        onClick={() => navigate('/trainer-dashboard')}
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
              placeholder="Enter a catchy title..."
              required 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div className="form-group">
            <label>Course Description</label>
            <textarea 
              placeholder="Describe what students will learn..."
              required 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          <div className="form-group">
            <label>Course Thumbnail</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setImage(e.target.files[0])} 
              />
            </div>
          </div>

          {/* 🔥 ADD: PDF UPLOAD */}
          <div className="form-group">
            <label>Course Syllabus (PDF)</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={e => setSyllabus(e.target.files[0])} 
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
