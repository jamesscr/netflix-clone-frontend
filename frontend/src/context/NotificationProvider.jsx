import React, { createContext, useState } from "react";
import "../styles/notification.scss";

export const NotificationContext = createContext();

let timeoutId;
export default function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const updateNotification = (type, message) => {
    if (timeoutId) clearTimeout(timeoutId);

    setNotification({ type, message });

    timeoutId = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "error":
        return "#e74c3c";
      case "success":
        return "#2ecc71";
      case "warning":
        return "#f39c12";
      default:
        return "#3498db";
    }
  };

  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      {notification && (
        <div
          className={`notification ${notification.type} show`}
          style={{ backgroundColor: getBackgroundColor(notification.type) }}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}
