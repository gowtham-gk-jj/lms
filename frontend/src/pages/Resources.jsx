import { useState, useEffect } from "react";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Module 5: Fetching real resource data
  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Replace with your actual endpoint when ready
        const res = await fetch("http://localhost:5000/api/resources");
        const data = await res.json();
        setResources(data || []);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="org-content">
      <div className="card">
        <h2>Learning Resources</h2>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>
          Download supplemental materials, guides, and assets for your courses.
        </p>

        {loading ? (
          <p>Loading resources...</p>
        ) : resources.length > 0 ? (
          <div className="resource-list" style={{ display: "grid", gap: "16px" }}>
            {resources.map((item) => (
              <div 
                key={item._id} 
                className="resource-item" 
                style={{ 
                  padding: "16px", 
                  border: "1px solid #dbe2f0", 
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h4 style={{ margin: 0, color: "#1e293b" }}>{item.title}</h4>
                  <small style={{ color: "#94a3b8" }}>{item.type} • {item.size}</small>
                </div>
                <a 
                  href={item.url} 
                  className="save" 
                  style={{ textDecoration: "none", fontSize: "12px" }}
                  download
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", background: "#f8fafc", borderRadius: "12px" }}>
            <span style={{ fontSize: "40px" }}>📚</span>
            <p style={{ marginTop: "10px", color: "#64748b" }}>
              No resources have been uploaded to this section yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}