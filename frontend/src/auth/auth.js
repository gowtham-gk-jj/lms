// Handles login session

export const saveUser = (data) => {
  // 1. Save the full user object (Module 1 logic)
  localStorage.setItem("user", JSON.stringify(data));

  // 2. 🔥 MODULE 5 FIX: Extract and save specific keys for the Dashboard and Interceptor
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  
  // Extract ID (handling different backend naming conventions)
  const id = data.user?._id || data.user?.id;
  if (id) {
    localStorage.setItem("userId", id);
  }
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.clear();
  // Optional: Redirect to login after clear
  window.location.href = "/login";
};