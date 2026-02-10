import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./CreateCourse.css";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
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
      await api.post("/courses", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Course Created ✅");
      navigate("/trainer-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <input type="file" onChange={(e) => setSyllabus(e.target.files[0])} />
      <button disabled={loading}>Create Course</button>
    </form>
  );
}
