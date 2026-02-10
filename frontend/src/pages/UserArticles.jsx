import { useState, useEffect } from "react";
import api from "../api/axios";

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
      // ✅ NEW API (public)
      const res = await api.get("/articles/published");
      setArticles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading articles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate estimated read time
  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const filtered = articles.filter(
    (a) =>
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
      {/* ================= HERO ================= */}
      <section
        style={{
          padding: "100px 20px",
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 48, fontWeight: 800 }}>Knowledge Hub</h1>
        <p style={{ fontSize: 20, marginTop: 16 }}>
          Explore deep-dives, tutorials, and industry insights.
        </p>

        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginTop: 40,
            padding: "18px 24px",
            width: "100%",
            maxWidth: 600,
            borderRadius: 14,
            border: "none",
            fontSize: 16,
          }}
        />
      </section>

      {/* ================= GRID ================= */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <h2>No articles found</h2>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: 32,
              }}
            >
              {filtered.map((article) => (
                <article
                  key={article._id}
                  onClick={() => setSelectedArticle(article)}
                  style={{
                    background: "#fff",
                    padding: 30,
                    borderRadius: 24,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#4f46e5" }}>
                    {article.category}
                  </span>

                  <h3 style={{ marginTop: 10 }}>{article.title}</h3>

                  <p style={{ marginTop: 10 }}>
                    {article.content.substring(0, 140)}...
                  </p>

                  <p style={{ fontSize: 12, marginTop: 10 }}>
                    ⏱️ {getReadTime(article.content)} min read
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 40,
              borderRadius: 20,
              maxWidth: 800,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2>{selectedArticle.title}</h2>
            <p style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
