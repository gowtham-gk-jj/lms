import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch notifications
export const fetchNotifications = async () => {
  const res = await axios.get(API_URL, getAuthHeader());
  return res.data;
};

// Mark as read
export const markNotificationAsRead = async (id) => {
  const res = await axios.put(
    `${API_URL}/${id}/read`,
    {},
    getAuthHeader()
  );
  return res.data;
};
