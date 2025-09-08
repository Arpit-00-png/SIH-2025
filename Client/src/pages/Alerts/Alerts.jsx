import React, { useState } from 'react'
import { Bell, Plus, X, Calendar, Clock } from 'lucide-react'
import './Alerts.css'

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'IIT Delhi Application Deadline',
      message: 'Application deadline for Computer Science program is approaching',
      date: '2024-02-15',
      time: '23:59',
      type: 'deadline',
      read: false
    },
    {
      id: 2,
      title: 'New Scholarship Available',
      message: 'Merit-based scholarship for Engineering students',
      date: '2024-02-10',
      time: '10:00',
      type: 'scholarship',
      read: true
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    date: '',
    time: '',
    type: 'general'
  })

  const handleAddAlert = (e) => {
    e.preventDefault()
    if (newAlert.title && newAlert.message) {
      const alert = {
        id: alerts.length + 1,
        ...newAlert,
        read: false
      }
      setAlerts([alert, ...alerts])
      setNewAlert({ title: '', message: '', date: '', time: '', type: 'general' })
      setShowAddForm(false)
    }
  }

  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ))
  }

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h1>Alerts & Notifications</h1>
        <p>Stay updated with important deadlines and opportunities</p>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Add Alert
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
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
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
                onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newAlert.date}
                  onChange={(e) => setNewAlert({...newAlert, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={newAlert.time}
                  onChange={(e) => setNewAlert({...newAlert, time: e.target.value})}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add Alert</button>
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
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card ${alert.read ? 'read' : 'unread'}`}>
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
  )
}

export default Alerts