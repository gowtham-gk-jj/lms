import api from "./axios";

export const adminReportApi = {
  getReports: async () => {
    const response = await api.get("/api/reports");
    return response.data;
  },

  generateReport: async (data) => {
    const response = await api.post(
      "/api/reports/generate",
      data
    );
    return response.data;
  }
};
