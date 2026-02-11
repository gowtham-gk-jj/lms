import api from "./axios";

export const adminUserApi = {
  getAllUsers: async () => {
    const response = await api.get("/api/auth/users");
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(
      `/api/auth/users/${userId}/status`,
      { isActive }
    );
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/api/auth/users/${userId}`);
    return response.data;
  }
};
