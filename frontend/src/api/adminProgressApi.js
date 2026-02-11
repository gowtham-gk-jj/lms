import api from "./axios";

export const adminProgressApi = {
  getAllProgress: async () => {
    const response = await api.get("/api/progress");
    return response.data;
  },

  getUserProgress: async (userId) => {
    const response = await api.get(
      `/api/progress/${userId}`
    );
    return response.data;
  }
};
