export const handleApiError = (err) => {
  if (err.response?.status === 401) {
    alert("Session expired. Please login again.");
    localStorage.clear();
    window.location.href = "/login";
  } else {
    console.error(err.response?.data || err.message);
  }
};
