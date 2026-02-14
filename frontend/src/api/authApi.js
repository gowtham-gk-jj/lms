const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AUTH_BASE = `${API_BASE}/api/auth`;

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

const getToken = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return storedUser?.token;
};

export const authApi = {
  login: async (email, password) => {
    const response = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${AUTH_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  resetPassword: async (token, password) => {
    const response = await fetch(`${AUTH_BASE}/reset-password/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    return handleResponse(response);
  },

  // ✅ ADD THIS
  getAllUsers: async () => {
    const token = getToken();

    const response = await fetch(`${AUTH_BASE}/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  // ✅ ADD THIS
  updateUserStatus: async (id) => {
    const token = getToken();

    const response = await fetch(`${AUTH_BASE}/users/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};
