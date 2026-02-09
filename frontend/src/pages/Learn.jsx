import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Learn() {
  const { id, level } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningContent = async () => {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      const token = storedUser?.token;

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // ✅ The "Correct Way": Fetch course data from backend
        // This ensures the student is actually enrolled before showing videos
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourse(res.data);
      } catch (err) {
        console.error("Error loading content:", err);
        alert("Access denied or course not found.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningContent();
  }, [id, navigate]);

  if (loading) return <div style={styles.loading}>Loading Learning Modules...</div>;
  if (!course) return <div style={styles.loading}>Course not found.</div>;

  // Assume the backend provides levels as an object or array
  // If your backend structure is different, we adjust this mapping
  const content = course.levels?.[level] || { videos: [], quizzes: [] };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        <h2 style={styles.title}>{course.title} – <span style={styles.levelText}>{level.toUpperCase()}</span></h2>
      </header>

      <div style={styles.tabBar}>
        <button style={styles.activeTab}>📺 Videos</button>
        <button style={styles.inactiveTab}>📝 Quiz</button>
      </div>

      <div style={styles.contentArea}>
        <h3>Module Videos</h3>
        {content.videos && content.videos.length > 0 ? (
          content.videos.map((v, i) => (
            <div key={i} style={styles.videoCard}>
              <div style={styles.videoIcon}>▶</div>
              <div style={styles.videoLinkWrapper}>
                <p style={styles.videoLabel}>Video Lesson {i + 1}</p>
                <a href={v} target="_blank" rel="noreferrer" style={styles.link}>
                  Watch Lesson
                </a>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.emptyMsg}>No videos available for this level yet.</p>
        )}
      </div>
    </div>
  );
}

// Inline styles to maintain look without external CSS request
const styles = {
  container: { padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" },
  backBtn: { background: "none", border: "1px solid #ddd", padding: "8px 15px", borderRadius: "8px", cursor: "pointer" },
  title: { margin: 0, fontSize: "24px", color: "#1e293b" },
  levelText: { color: "#22c55e" },
  tabBar: { display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "15px" },
  activeTab: { padding: "10px 20px", background: "#22c55e", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  inactiveTab: { padding: "10px 20px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", cursor: "pointer" },
  contentArea: { background: "#fff", padding: "20px", borderRadius: "12px" },
  videoCard: { display: "flex", alignItems: "center", padding: "15px", border: "1px solid #f1f5f9", borderRadius: "10px", marginBottom: "10px", background: "#f8fafc" },
  videoIcon: { width: "40px", height: "40px", background: "#fee2e2", color: "#ef4444", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", marginRight: "15px", fontWeight: "bold" },
  videoLabel: { margin: "0 0 5px 0", fontWeight: "bold", color: "#334155" },
  link: { color: "#2563eb", textDecoration: "none", fontSize: "14px" },
  loading: { textAlign: "center", marginTop: "100px", color: "#64748b" },
  emptyMsg: { color: "#94a3b8", fontStyle: "italic" }
};