import api from "./axios";

export const getArticles = () =>
  api.get("/api/articles");

export const getPublishedArticles = () =>
  api.get("/api/articles/published");

export const createArticle = (data) =>
  api.post("/api/articles", data);

export const updateArticle = (id, data) =>
  api.put(`/api/articles/${id}`, data);

export const deleteArticle = (id) =>
  api.delete(`/api/articles/${id}`);

export const togglePublish = (id) =>
  api.patch(`/api/articles/${id}/publish`);
