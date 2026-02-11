import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios"; // ✅ correct path
import { useAuth } from "../../context/AuthContext";
import "./EditCourse.css";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /* ===============================
     FETCH COURSE DETAILS
  ================================ */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(
          `/courses/${id}`, // 🔥 make sure backend route matches
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 🔥 Safe response handling
        const data = res.data?.data || res.data;

        setTitle(data?.title || "");
        setDescription(data?.description || "");
      } catch (err) {
        console.error("FETCH COURSE ERROR:", err);
        alert(
          err?.response?.data?.message ||
            "Failed to load course details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchCourse();
    }
  }, [id, token]);

  /* ===============================
     UPDATE COURSE
  ================================ */
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (image) formData.append("image", image);
    if (syllabus) formData.append("syllabus", syllabus);

    try {
      setUpdating(true);

      await api.put(
        `/courses/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 important
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Course updated successfully");
      navigate("/trainer-dashboard");
    } catch (err) {
      console.error("UPDATE COURSE ERROR:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to update course"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <div className="loading">Fetching course data...</div>;

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
