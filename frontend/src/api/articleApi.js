import api from "./axios";

export const getArticles = () => api.get("/articles");
export const getPublishedArticles = () => api.get("/articles/published");

export const createArticle = (data) =>
  api.post("/articles", data);

export const updateArticle = (id, data) =>
  api.put(`/articles/${id}`, data);

export const deleteArticle = (id) =>
  api.delete(`/articles/${id}`);

export const togglePublish = (id) =>
  api.patch(`/articles/${id}/publish`);
