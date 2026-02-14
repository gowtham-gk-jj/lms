const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AUTH_BASE = `${API_BASE}/api/auth`;

/* ================= HANDLE RESPONSE ================= */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

/* ================= SAFE TOKEN GETTER ================= */
const getToken = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    const parsed = JSON.parse(storedUser);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

/* ================= API ================= */
export const authApi = {
  /* LOGIN */
  login: async (email, password) => {
    const response = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
  },

  /* FORGOT PASSWORD */
  forgotPassword: async (email) => {
    const response = await fetch(`${AUTH_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  /* RESET PASSWORD */
  resetPassword: async (token, password) => {
    const response = await fetch(`${AUTH_BASE}/reset-password/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    return handleResponse(response);
  },

  /* GET ALL USERS */
  getAllUsers: async () => {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await fetch(`${AUTH_BASE}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  /* UPDATE USER STATUS */
  updateUserStatus: async (id) => {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found.");
    }

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
