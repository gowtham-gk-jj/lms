import React, { useState, useEffect } from "react";
// ✅ Fix 1: Ensure this path matches your folder structure exactly
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublish
} from "../api/articleApi"; 

import "./AdminArticles.css";

export default function AdminArticles() {
  // ✅ Fix 2: Initialize as empty array to prevent .map() errors
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    content: "",
    published: false
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await getArticles();
      // Ensure we set an array even if res.data is null
      setArticles(res.data || []);
    } catch (err) {
      console.error("Fetch articles error:", err);
      setArticles([]); // Safety fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const articleData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : []
    };

    try {
      if (editingArticle) {
        await updateArticle(editingArticle._id || editingArticle.id, articleData);
      } else {
        await createArticle(articleData);
      }
      fetchArticles();
      resetForm();
      alert("✅ Article saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving article");
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || "",
      category: article.category || "",
      tags: article.tags ? article.tags.join(", ") : "",
      content: article.content || "",
      published: !!article.published
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await deleteArticle(id);
      fetchArticles();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await togglePublish(id);
      fetchArticles(); 
    } catch (err) {
      alert("Status update failed");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", tags: "", content: "", published: false });
    setEditingArticle(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading-state">Loading Management Console...</div>;

  return (
    <div className="admin-articles-container">
      <header className="admin-header">
        <div className="header-text">
          <h1>📊 Article Management</h1>
          <p>Module 5: Content Administration</p>
        </div>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Article"}
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card total">
          <h3>Total</h3>
          <p>{articles.length}</p>
        </div>
        <div className="stat-card published">
          <h3>Published</h3>
          <p>{articles.filter(a => a.published).length}</p>
        </div>
        <div className="stat-card draft">
          <h3>Drafts</h3>
          <p>{articles.filter(a => !a.published).length}</p>
        </div>
      </section>

      {showForm && (
        <div className="form-wrapper section-box">
          <h2>{editingArticle ? "📝 Edit Article" : "✨ Create New Article"}</h2>
          <form onSubmit={handleSubmit} className="article-form">
            <input
              type="text"
              placeholder="Article Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
            />
            <textarea
              rows="5"
              placeholder="Content..."
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              required
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={e => setFormData({ ...formData, published: e.target.checked })}
              />
              Make this article public
            </label>
            <div className="form-actions">
              <button type="submit" className="save-btn">Update Database</button>
              <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="section-box list-container">
        <div className="article-list">
          {articles.length === 0 ? (
            <p className="empty-text">No articles found in database.</p>
          ) : (
            articles.map(article => (
              <div key={article._id || article.id} className="article-row">
                <div className="article-info">
                  <span className={`status-pill ${article.published ? 'pub' : 'drf'}`}>
                    {article.published ? "Live" : "Draft"}
                  </span>
                  <strong>{article.title}</strong>
                </div>

                <div className="row-actions">
                  <button className="btn-toggle" onClick={() => handleTogglePublish(article._id || article.id)}>
                    {article.published ? "Hide" : "Publish"}
                  </button>
                  <button className="btn-edit" onClick={() => handleEdit(article)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(article._id || article.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}