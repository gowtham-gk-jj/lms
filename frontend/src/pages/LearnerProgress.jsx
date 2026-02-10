import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./LearnerProgress.css";

const LearnerProgress = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/progress");
        setEnrollments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load progress:", err);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.learner?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading student progress...</p>;

  return (
    <div className="lp-container">
      <h1>Detailed Student Progress</h1>

      <input
        type="text"
        placeholder="Search student or course"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredEnrollments.map((en) => (
        <div key={en._id}>
          {en.learner?.name} - {en.course?.title} ({en.progress}%)
        </div>
      ))}
    </div>
  );
};

export default LearnerProgress;
