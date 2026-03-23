import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAppointments, cancelAppointment } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

// Mock appointments for demo
const MOCK_APPOINTMENTS = [
  { _id: 'a1', doctor: { user: { name: 'Dr. Arjun Sharma' }, specialization: 'Cardiologist' }, date: '2026-03-28', time: '10:00 AM', status: 'confirmed', reason: 'Chest pain follow-up' },
  { _id: 'a2', doctor: { user: { name: 'Dr. Priya Nair' }, specialization: 'Neurologist' }, date: '2026-03-15', time: '02:30 PM', status: 'completed', reason: 'Migraine consultation' },
  { _id: 'a3', doctor: { user: { name: 'Dr. Sneha Patel' }, specialization: 'Dermatologist' }, date: '2026-02-20', time: '11:00 AM', status: 'cancelled', reason: 'Skin rash' },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getMyAppointments()
      .then(({ data }) => { if (data.length > 0) setAppointments(data); })
      .catch(() => {});
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
      );
      setMsg('Appointment cancelled.');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Failed to cancel. Try again.');
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);
  const upcoming = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;

  return (
    <div className="page dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Manage your appointments and health records</p>
        </div>
        <Link to="/doctors" className="btn btn-primary">+ Book Appointment</Link>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="sc-icon">📅</div>
          <div className="sc-value">{upcoming}</div>
          <div className="sc-label">Upcoming</div>
        </div>
        <div className="stat-card">
          <div className="sc-icon">✅</div>
          <div className="sc-value">{completed}</div>
          <div className="sc-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="sc-icon">📋</div>
          <div className="sc-value">{appointments.length}</div>
          <div className="sc-label">Total</div>
        </div>
      </div>

      {msg && <div className="success-msg">{msg}</div>}

      {/* Appointments */}
      <div className="section-header">
        <h2>My Appointments</h2>
        <div className="filter-tabs">
          {['all', 'confirmed', 'completed', 'cancelled'].map((f) => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="appointments-list">
        {filtered.map((apt) => (
          <div key={apt._id} className="appointment-item">
            <div className="apt-avatar">{apt.doctor?.user?.name?.charAt(3)}</div>
            <div className="apt-info">
              <div className="apt-doctor">{apt.doctor?.user?.name}</div>
              <div className="apt-spec">{apt.doctor?.specialization}</div>
              <div className="apt-reason">Reason: {apt.reason || 'General consultation'}</div>
            </div>
            <div className="apt-datetime">
              <div className="apt-date">📅 {apt.date}</div>
              <div className="apt-time">🕐 {apt.time}</div>
            </div>
            <div className="apt-status">
              <span className={`badge badge-${apt.status}`}>{apt.status}</span>
            </div>
            <div className="apt-actions">
              {apt.status === 'confirmed' && (
                <button className="btn btn-danger" style={{ fontSize: '0.82rem', padding: '6px 14px' }} onClick={() => handleCancel(apt._id)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>📭</div>
            <p>No {filter === 'all' ? '' : filter} appointments found.</p>
            <Link to="/doctors" className="btn btn-primary" style={{ marginTop: 12 }}>Find a Doctor</Link>
          </div>
        )}
      </div>
    </div>
  );
}
