import { useState, useEffect } from "react";
import api from "../api/axios";
import "./UserArticles.css";

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
      const res = await api.get("/api/articles/published");
      setArticles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading articles:", err);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="articles-loading">
        <div className="loader"></div>
        <p>Fetching the latest insights...</p>
      </div>
    );
  }

  return (
    <div className="articles-page">
      {/* HERO */}
      <section className="articles-hero">
        <h1>Knowledge Hub</h1>
        <p>
          Explore deep-dives, tutorials, and industry insights.
        </p>

        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="articles-search"
        />
      </section>

      {/* GRID */}
      <section className="articles-grid-section">
        <div className="articles-grid-container">
          {filtered.length === 0 ? (
            <div className="articles-empty">
              <h2>No articles found</h2>
            </div>
          ) : (
            <div className="articles-grid">
              {filtered.map((article) => (
                <article
                  key={article._id}
                  onClick={() => setSelectedArticle(article)}
                  className="article-card"
                >
                  <span className="article-category">
                    {article.category}
                  </span>

                  <h3>{article.title}</h3>

                  <p>
                    {article.content.substring(0, 140)}...
                  </p>

                  <p className="read-time">
                    ⏱️ {getReadTime(article.content)} min read
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {selectedArticle && (
        <div
          className="article-modal-overlay"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="article-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedArticle.title}</h2>
            <p className="article-modal-content">
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
