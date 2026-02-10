import api from "./axios";

/**
 * ===============================
 * AUTH API (AXIOS BASED) – ACTIVE
 * ===============================
 */
export const authApi = {
  /* ================= LOGIN ================= */
  login: async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const data = res.data;

    // ✅ STORE TOKEN + USER DATA
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("role", data.user.role);
    }

    return data;
  },

  /* ================= PASSWORD ================= */
  forgotPassword: async (email) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (token, password) => {
    const res = await api.put(`/auth/reset-password/${token}`, {
      password,
    });
    return res.data;
  },

  /* ================= ADMIN ================= */

  getAllUsers: async () => {
    const res = await api.get("/auth/users");
    return res.data;
  },

  createUser: async (userData) => {
    const res = await api.post("/auth/users", userData);
    return res.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const res = await api.put(`/auth/users/${userId}/status`, {
      isActive,
    });
    return res.data;
  },

  /* ================= LOGOUT ================= */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  },
};

/* ======================================================
   LEGACY FETCH IMPLEMENTATION (KEPT FOR REFERENCE ONLY)
   ❗ DO NOT USE – Axios is ACTIVE
   ====================================================== */

/**
 * Common response handler
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

/**
 * Helper to attach token automatically
 * (Legacy support only)
 */
export const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/*
const legacyAuthApi = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await handleResponse(response);

    if (result.user && (result.user._id || result.user.id)) {
      localStorage.setItem("userId", result.user._id || result.user.id);
    }

    return result;
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  resetPassword: async (token, password) => {
    const response = await fetch(`${BASE_URL}/reset-password/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },
};
*/
