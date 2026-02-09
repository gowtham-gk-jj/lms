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
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (id) => {
    await markNotificationAsRead(id);
    loadNotifications();
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
