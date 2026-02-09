import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddVideos.css";

export default function AddVideos() {
  const { id, level } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState(""); // Added title for better content tracking

  const handleAddVideo = () => {
    if (!url || !title) {
      alert("Please provide both a title and a URL");
      return;
    }

    const courses = JSON.parse(localStorage.getItem("courses")) || [];

    const updated = courses.map((course) => {
      if (course.id === Number(id)) {
        // Ensure the levels and specific level object exists
        if (!course.levels) course.levels = {};
        if (!course.levels[level]) course.levels[level] = { videos: [] };

        // Immutable update: create a new array instead of pushing
        course.levels[level].videos = [
          ...course.levels[level].videos,
          { title, url, id: Date.now() }
        ];
      }
      return course;
    });

    localStorage.setItem("courses", JSON.stringify(updated));
    alert("Content added successfully! ✅");
    setUrl("");
    setTitle("");
  };

  return (
    <div className="add-videos-container">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back to Course
      </button>

      <div className="section-box">
        <div className="header-group">
          <h2>Add Content: <span className="level-badge">{level?.toUpperCase()}</span></h2>
          <p>Add YouTube lessons, PDFs, or external resource links.</p>
        </div>

        <div className="form-content">
          <div className="input-group">
            <label>Lesson Title</label>
            <input
              type="text"
              placeholder="e.g., Introduction to React Hooks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Resource URL</label>
            <input
              type="text"
              placeholder="https://youtube.com/... or https://drive.google.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button className="primary-btn" onClick={handleAddVideo}>
            Upload to {level} Level
          </button>
        </div>
      </div>
    </div>
  );
}