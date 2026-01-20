import React, { useEffect, useState } from "react";
import axios from "axios";
import {io} from "socket.io-client";
import './NotificationBell.css';
import { FiBell, FiCheck, FiTrash2, FiClock, FiAlertCircle } from 'react-icons/fi';
import toast from "react-hot-toast";
import BACKEND_URL from '../../config.js';
interface Notification {
  _id: string;
  taskId?: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  // const [_socket, setSocket] = useState<Socket | null>(null);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/task/notifications`, { withCredentials: true });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter((n: Notification) => !n.isRead).length);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch notifications");
      console.error("❌ Error fetching notifications", error);
    }
  };

  useEffect(() => {
   fetchNotifications();

  // Create socket connection inside useEffect
  const newSocket = io(BACKEND_URL);
  // setSocket(newSocket);

  newSocket.on("connect", () => {
    console.log("✅ Socket connected");
  });

  // Listen to socket for new overdue tasks
  newSocket.on("refreshNotifications", async (tasks: any[]) => {
    for (const task of tasks) {
      try {
        // Only create a notification if it doesn't already exist in DB
        await axios.post(`${BACKEND_URL}/task/notifications`, {
          userId: task.createdBy,
          taskId: task._id,
          type: "task-overdue",
          message: `Task "${task.name}" is overdue!`,
        }, { 
          withCredentials: true 
        });
      } catch (error) {
        // If the notification already exists, just ignore the error!!!
        console.error("❌ Error creating notification .If the notification already exists, just ignore the error", error);
      }
    }
    
    // Refresh notifications list and counter
    fetchNotifications();
  });

  // Cleanup socket connection on unmount
  return () => {
    newSocket.off("refreshNotifications");
    newSocket.disconnect();
  };
  }, []);

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    try {
      await axios.put(`${BACKEND_URL}/task/notifications/${id}/mark-as-read`, {}, { withCredentials: true });
      fetchNotifications();
      toast.success("Notification marked as read");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to mark notification as read");
      console.error("❌ Error marking notification as read", error);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      await axios.put(`${BACKEND_URL}/task/notifications/clear`, {}, { withCredentials: true });
      fetchNotifications();
      toast.success("All notifications cleared");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to clear notifications");
      console.error("❌ Error clearing notifications", error);
    }
  };

  // Format time difference
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const CloseButton = () => (
    <div className="dropdown-footer">
      <button className="view-all-btn" onClick={() => setOpen(false)}>
        Close
      </button>
    </div>
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task-overdue":
        return <FiAlertCircle className="notification-icon overdue" />;
      default:
        return <FiClock className="notification-icon default" />;
    }
  };

  return (
    <div className="notification-bell-container">
      <div className={`bell-icon-wrapper ${unreadCount > 0 ? 'has-notifications' : ''}`} onClick={() => setOpen(!open)}>
        <FiBell className="bell-icon" size={22} />
        {unreadCount > 0 && (
          <div className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </div>

      {open && (
        <>
          <div className="notification-backdrop" onClick={() => setOpen(false)}></div>
          <div className="notification-dropdown">
            <div className="dropdown-header">
              <div className="header-content">
                <h3>Notifications</h3>
                {unreadCount > 0 && <span className="unread-count-badge">{unreadCount} unread</span>}
              </div>
              <div className="header-actions">
                {notifications.length > 0 && (
                  <button className="clear-all-btn" onClick={clearAll} title="Clear all notifications">
                    <FiTrash2 size={16} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            <div className="notifications-scroll-container">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <FiBell size={48} className="empty-icon" />
                  <p>No notifications yet</p>
                  <span className="empty-subtitle">You're all caught up!</span>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map((n) => (
                    <div key={n._id} className={`notification-item ${n.isRead ? 'read' : 'unread'}`}>
                      <div className="notification-icon-container">{getNotificationIcon(n.type)}</div>
                      <div className="notification-content">
                        <p className="notification-message">{n.message}</p>
                        <div className="notification-meta">
                          <span className="notification-time">{formatTimeAgo(n.createdAt)}</span>
                          {n.type === "task-overdue" && <span className="notification-tag overdue-tag">Overdue</span>}
                        </div>
                      </div>
                      <div className="notification-actions">
                        {!n.isRead && (
                          <button className="mark-read-btn" onClick={() => markAsRead(n._id)} title="Mark as read">
                            <FiCheck size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <CloseButton />
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
