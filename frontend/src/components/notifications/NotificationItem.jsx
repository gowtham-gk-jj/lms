export default function NotificationItem({ notification, onRead }) {
  // Prevent crash if notification is undefined/null
  if (!notification) return null;

  const {
    _id,
    title = "No Title",
    message = "No message",
    createdAt,
    isRead = false,
  } = notification;

  return (
    <div className={`notification-card ${isRead ? "read" : "unread"}`}>
      <h4>{title}</h4>
      <p>{message}</p>

      <small>
        {createdAt
          ? new Date(createdAt).toLocaleString()
          : "No date available"}
      </small>

      {!isRead && (
        <button onClick={() => onRead && onRead(_id)}>
          Mark as Read
        </button>
      )}
    </div>
  );
}
