// src/pages/Alerts.jsx
import React, { useState, useEffect } from "react";
import { Bell, Plus, X, Calendar, Clock } from "lucide-react";
import { messaging } from "../../firebase-config";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import "./Alerts.css";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [fcmToken, setFcmToken] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    date: "",
    time: "",
    type: "general",
  });

  // 🔹 Ask permission & get FCM token
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BPX5who3pxGwvAMNi7dS_pRL5dHp0AS9WeYlk4m1NQdXdj60Vmw-uM0fJb4ZUaafKBYgBFGZ3aDLBS80sIOv4UY",
        });
        console.log("✅ FCM Token:", token);
        setFcmToken(token);
        alert("Notifications enabled!");
      } else {
        alert("Notifications blocked");
      }
    } catch (err) {
      console.error("Error getting FCM token", err);
    }
  };

  // 🔹 Send notification via backend
  const sendNotification = async () => {
    if (!fcmToken) {
      alert("No FCM token. Please enable notifications first.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/send-notification", {
        token: fcmToken,
        title: "🚀 Test Alert",
        body: "This is a test push notification",
      });
      console.log("Notification response:", res.data);
      alert("Notification sent!");
    } catch (err) {
      console.error("Error sending notification", err);
      alert("Failed to send notification");
    }
  };

  // 🔹 Listen for foreground messages
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Message received: ", payload);

      const alert = {
        id: alerts.length + 1,
        title: payload.notification?.title || "New Notification",
        message: payload.notification?.body || "You have a new message",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),
        type: "general",
        read: false,
      };
      setAlerts((prev) => [alert, ...prev]);
    });

    return () => unsubscribe();
  }, [alerts]);

  // 🔹 Local alert functions
  const handleAddAlert = (e) => {
    e.preventDefault();
    if (newAlert.title && newAlert.message) {
      const alert = {
        id: alerts.length + 1,
        ...newAlert,
        read: false,
      };
      setAlerts([alert, ...alerts]);
      setNewAlert({ title: "", message: "", date: "", time: "", type: "general" });
      setShowAddForm(false);
    }
  };

  const markAsRead = (id) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h1>Alerts & Notifications</h1>
        <p>Stay updated with important deadlines and opportunities</p>

        <button onClick={requestPermission} className="btn btn-primary">
          Enable Push Notifications
        </button>
        <button onClick={sendNotification} className="btn btn-primary">
          Send Test Notification
        </button>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
          <Plus size={20} /> Add Alert
        </button>
      </div>

      {showAddForm && (
        <div className="add-alert-form">
          <form onSubmit={handleAddAlert}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="deadline">Deadline</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={newAlert.message}
                onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newAlert.date}
                  onChange={(e) => setNewAlert({ ...newAlert, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={newAlert.time}
                  onChange={(e) => setNewAlert({ ...newAlert, time: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Alert
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-card ${alert.read ? "read" : "unread"}`}>
            <div className="alert-icon">
              <Bell size={20} />
            </div>
            <div className="alert-content">
              <div className="alert-header">
                <h3>{alert.title}</h3>
                <div className="alert-actions">
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="action-btn"
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="action-btn delete"
                    title="Delete"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-meta">
                <span className="alert-date">
                  <Calendar size={14} />
                  {alert.date}
                </span>
                <span className="alert-time">
                  <Clock size={14} />
                  {alert.time}
                </span>
                <span className={`alert-type ${alert.type}`}>{alert.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
