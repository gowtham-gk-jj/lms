import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function UserArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // ✅ Module 5: Fetching from the published endpoint
      const res = await axios.get("/articles/published");
      setArticles(res.data);
    } catch (err) {
      console.error("Error loading articles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate estimated read time for the learner
  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: 100, textAlign: "center", color: "#64748b" }}>
        <div className="loader"></div>
        <p>Fetching the latest insights...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8fafc" }}>

      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          width: "100%",
          padding: "100px 20px",
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "#fff",
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, letterSpacing: "-1px" }}>
            Knowledge Hub
          </h1>
          <p style={{ fontSize: 20, opacity: 0.9, marginBottom: 40 }}>
            Explore deep-dives, tutorials, and industry insights curated by our top instructors.
          </p>

          <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Search articles, topics, or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: "14px",
                border: "none",
                fontSize: 16,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                outline: "none"
              }}
            />
          </div>
        </div>
      </section>

      {/* ================= ARTICLES GRID ================= */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
              <span style={{ fontSize: 50 }}>🔍</span>
              <h2 style={{ color: "#1e293b", marginTop: 20 }}>No articles match your search</h2>
              <p style={{ color: "#64748b" }}>Try different keywords or browse all categories.</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: 32
              }}
            >
              {filtered.map(article => (
                <article
                  key={article._id}
                  onClick={() => setSelectedArticle(article)}
                  style={{
                    background: "#fff",
                    padding: 30,
                    borderRadius: 24,
                    cursor: "pointer",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
                    border: "1px solid #f1f5f9",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      ⏱️ {getReadTime(article.content)} min read
                    </span>
                  </div>

                  <h3 style={{ fontSize: 22, color: "#0f172a", marginBottom: 12, lineHeight: 1.3 }}>
                    {article.title}
                  </h3>

                  <p style={{ color: "#475569", lineHeight: 1.6, fontSize: 15, flexGrow: 1 }}>
                    {article.content.substring(0, 140)}...
                  </p>

                  <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {article.tags?.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#f1f5f9",
                          color: "#64748b",
                          padding: "4px 12px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 500
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ================= READING MODAL ================= */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "60px 50px",
              borderRadius: 30,
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
            }}
          >
            <button 
                onClick={() => setSelectedArticle(null)}
                style={{ position: "absolute", top: 30, right: 30, border: "none", background: "#f1f5f9", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 20 }}
            >
                ✕
            </button>

            <header style={{ marginBottom: 40, textAlign: "center" }}>
                <span style={{ color: "#4f46e5", fontWeight: 700, textTransform: "uppercase" }}>{selectedArticle.category}</span>
                <h2 style={{ fontSize: 36, marginTop: 10, color: "#0f172a" }}>{selectedArticle.title}</h2>
                <div style={{ marginTop: 15, color: "#94a3b8", fontSize: 14 }}>
                    Published in Knowledge Hub • {getReadTime(selectedArticle.content)} minute read
                </div>
            </header>

            <div style={{ 
                lineHeight: 2, 
                fontSize: 18, 
                color: "#334155", 
                whiteSpace: "pre-wrap",
                borderTop: "1px solid #f1f5f9",
                paddingTop: 40
            }}>
              {selectedArticle.content}
            </div>

            <footer style={{ marginTop: 50, textAlign: "center" }}>
                <button
                  onClick={() => setSelectedArticle(null)}
                  style={{
                    background: "#0f172a",
                    color: "#fff",
                    padding: "16px 40px",
                    borderRadius: 14,
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 16
                  }}
                >
                  Finished Reading
                </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}