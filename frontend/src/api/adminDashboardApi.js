import api from "./axios";

export const adminDashboardApi = {
  getDashboardStats: async () => {
    const response = await api.get("/api/dashboard");
    return response.data;
  },

  getAdminOverview: async () => {
    const response = await api.get("/api/dashboard/overview");
    return response.data;
  }
};
