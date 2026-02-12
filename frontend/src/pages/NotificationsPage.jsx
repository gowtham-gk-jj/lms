import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../services/notificationService";
import NotificationList from "../components/notifications/NotificationList";
import "./NotificationsPage.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();

      // ✅ Ensure always array
      const safeData = Array.isArray(data)
        ? data
        : data?.notifications || [];

      setNotifications(safeData);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setNotifications([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      // Optimistic update (better UX)
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="notifications-page">
      <h2>🔔 Notifications</h2>

      <NotificationList
        notifications={notifications}
        onRead={handleRead}
      />
    </div>
  );
}
