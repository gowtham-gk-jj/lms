import api from "./axios";

export const authApi = {
  login: async (email, password) => {
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });

    const data = res.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  forgotPassword: async (email) => {
    const res = await api.post("/api/auth/forgot-password", {
      email,
    });
    return res.data;
  },

  resetPassword: async (token, password) => {
    const res = await api.put(
      `/api/auth/reset-password/${token}`,
      { password }
    );
    return res.data;
  },

  getAllUsers: async () => {
    const res = await api.get("/api/auth/users");
    return res.data;
  },

  createUser: async (userData) => {
    const res = await api.post("/api/auth/users", userData);
    return res.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const res = await api.put(
      `/api/auth/users/${userId}/status`,
      { isActive }
    );
    return res.data;
  },
};
