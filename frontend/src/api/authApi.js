const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

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
 */
export const authHeader = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export const authApi = {
  /* ================= AUTH ================= */

  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await handleResponse(response);

    // ✅ Store token
    if (result.token) {
      localStorage.setItem("token", result.token);
    }

    // ✅ Store role
    if (result.user?.role) {
      localStorage.setItem("role", result.user.role);
    }

    // ✅ Store userId
    if (result.user && (result.user._id || result.user.id)) {
      localStorage.setItem(
        "userId",
        result.user._id || result.user.id
      );
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
    const response = await fetch(
      `${BASE_URL}/reset-password/${token}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );
    return handleResponse(response);
  },

  /* ================= ADMIN ================= */

  getAllUsers: async () => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    return handleResponse(response);
  },

  createUser: async (userData) => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ isActive }),
      }
    );
    return handleResponse(response);
  },
};
