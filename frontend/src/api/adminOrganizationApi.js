import api from "./axios";

export const adminOrganizationApi = {
  getOrganizationSettings: async () => {
    const response = await api.get("/api/organization");
    return response.data;
  },

  updateOrganizationSettings: async (data) => {
    const response = await api.put(
      "/api/organization",
      data
    );
    return response.data;
  }
};
