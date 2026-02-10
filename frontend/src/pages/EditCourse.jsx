import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import "./EditCourse.css";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axios
      .get(`/courses/public/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load course details");
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    const token = storedUser?.token;

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    
    // Only append files if the user actually selected new ones
    if (image) formData.append("image", image);
    if (syllabus) formData.append("syllabus", syllabus);

    try {
      setUpdating(true);
      await axios.put(
        `http://localhost:5000/api/courses/${id}`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
          },
        }
      );
      alert("✅ Course updated successfully");
      navigate("/trainer-dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update course");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Fetching course data...</div>;

  return (
    <div className="edit-course-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Dashboard
      </button>

      <form className="edit-course-card" onSubmit={handleUpdate}>
        <h2>Edit Course</h2>

        <div className="form-group">
          <label>Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            required
          />
        </div>

        <div className="form-group file-group">
          <label>Update Course Thumbnail</label>
          <p className="file-hint">Leave empty to keep current image</p>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} 
          />
        </div>

        <div className="form-group file-group">
          <label>Update Syllabus (PDF)</label>
          <p className="file-hint">Leave empty to keep current syllabus</p>
          <input 
            type="file" 
            accept="application/pdf"
            onChange={(e) => setSyllabus(e.target.files[0])} 
          />
        </div>

        <button type="submit" className="update-btn" disabled={updating}>
          {updating ? "Saving Changes..." : "Update Course"}
        </button>
      </form>
    </div>
  );
}