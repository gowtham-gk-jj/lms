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
        

        const res = await axios.get(`/progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEnrollments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.learner?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      e.course?.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="lp-loading">Loading student progress...</p>;
  }

  return (
    <div className="lp-container">
      <h1 className="lp-title">Detailed Student Progress</h1>
      <p className="lp-subtitle">
        Viewing all active course enrollments and completion percentages.
      </p>

      <div className="lp-toolbar">
        <input
          type="text"
          placeholder="🔍 Search student or course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="lp-search"
        />
      </div>

      <div className="lp-table-wrapper">
        <table className="lp-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td colSpan="4" className="lp-empty">
                  No enrollment records found.
                </td>
              </tr>
            ) : (
              filteredEnrollments.map((en) => (
                <tr key={en._id}>
                  <td>
                    <strong>{en.learner?.name}</strong>
                    <br />
                    <span className="lp-email">
                      {en.learner?.email}
                    </span>
                  </td>

                  <td>{en.course?.title}</td>

                  <td>
                    <div className="lp-progress-bar">
                      <div
                        className="lp-progress-fill"
                        style={{ width: `${en.progress}%` }}
                      />
                    </div>
                    <span className="lp-progress-text">
                      {en.progress}%
                    </span>
                  </td>

                  <td>
                    <span
                      className={`lp-badge ${
                        en.progress === 100
                          ? "lp-complete"
                          : "lp-progress"
                      }`}
                    >
                      {en.progress === 100
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LearnerProgress;
