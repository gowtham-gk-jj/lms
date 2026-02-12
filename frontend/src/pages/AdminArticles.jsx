import React, { useState, useEffect, useCallback } from "react";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublish
} from "../api/articleApi";

import "./AdminArticles.css";

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    content: "",
    published: false
  });

  /* ================= FETCH ARTICLES ================= */
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getArticles();

      const articleList =
        res?.data?.data ||
        res?.data ||
        [];

      setArticles(Array.isArray(articleList) ? articleList : []);
    } catch (err) {
      console.error("Fetch articles error:", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const articleData = {
      ...formData,
      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : []
    };

    try {
      setSubmitting(true);

      if (editingArticle) {
        await updateArticle(
          editingArticle?._id || editingArticle?.id,
          articleData
        );
      } else {
        await createArticle(articleData);
      }

      await fetchArticles();
      resetForm();
      alert("✅ Article saved successfully!");
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Error saving article"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (article) => {
    if (!article) return;

    setEditingArticle(article);

    setFormData({
      title: article?.title || "",
      category: article?.category || "",
      tags: article?.tags
        ? article.tags.join(", ")
        : "",
      content: article?.content || "",
      published: !!article?.published
    });

    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this article?")) return;

    try {
      await deleteArticle(id);
      await fetchArticles();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  /* ================= TOGGLE PUBLISH ================= */
  const handleTogglePublish = async (id) => {
    if (!id) return;

    try {
      await togglePublish(id);
      await fetchArticles();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Status update failed"
      );
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      tags: "",
      content: "",
      published: false
    });

    setEditingArticle(null);
    setShowForm(false);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="loading-state">
        Loading Management Console...
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="admin-articles-container">

      {/* HEADER */}
      <header className="admin-header">
        <div className="header-text">
          <h1>📊 Article Management</h1>
          <p>Module 5: Content Administration</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
        >
          {showForm ? "Cancel" : "+ New Article"}
        </button>
      </header>

      {/* STATS */}
      <section className="stats-grid">
        <div className="stat-card total">
          <h3>Total</h3>
          <p>{articles.length}</p>
        </div>

        <div className="stat-card published">
          <h3>Published</h3>
          <p>{articles.filter((a) => a?.published).length}</p>
        </div>

        <div className="stat-card draft">
          <h3>Drafts</h3>
          <p>{articles.filter((a) => !a?.published).length}</p>
        </div>
      </section>

      {/* FORM */}
      {showForm && (
        <div className="form-wrapper section-box">
          <h2>
            {editingArticle
              ? "📝 Edit Article"
              : "✨ Create New Article"}
          </h2>

          <form onSubmit={handleSubmit} className="article-form">

            <input
              type="text"
              placeholder="Article Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value
                })
              }
            />

            <textarea
              rows="5"
              placeholder="Content..."
              value={formData.content}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: e.target.value
                })
              }
              required
            />

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    published: e.target.checked
                  })
                }
              />
              Make this article public
            </label>

            <div className="form-actions">
              <button
                type="submit"
                className="save-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editingArticle
                  ? "Update Article"
                  : "Create Article"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST */}
      <div className="section-box list-container">
        {articles.length === 0 ? (
          <p className="empty-text">
            No articles found in database.
          </p>
        ) : (
          articles.map((article) => {
            const id = article?._id || article?.id;

            return (
              <div key={id} className="article-row">
                <div className="article-info">
                  <span
                    className={`status-pill ${
                      article?.published ? "pub" : "drf"
                    }`}
                  >
                    {article?.published ? "Live" : "Draft"}
                  </span>

                  <strong>{article?.title}</strong>
                </div>

                <div className="row-actions">
                  <button
                    className="btn-toggle"
                    onClick={() => handleTogglePublish(id)}
                  >
                    {article?.published ? "Hide" : "Publish"}
                  </button>

                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(article)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
