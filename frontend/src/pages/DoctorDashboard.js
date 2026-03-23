import React, { useState, useEffect } from 'react';
import { getDoctorAppointments, completeAppointment, cancelAppointment } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const MOCK = [
  { _id: 'd1', patient: { name: 'Rahul Verma', phone: '+91 98765 43210' }, date: '2026-03-23', time: '09:00 AM', status: 'confirmed', reason: 'Chest pain follow-up' },
  { _id: 'd2', patient: { name: 'Sunita Roy', phone: '+91 91234 56789' }, date: '2026-03-23', time: '11:00 AM', status: 'confirmed', reason: 'Regular checkup' },
  { _id: 'd3', patient: { name: 'Aman Singh', phone: '+91 70000 11111' }, date: '2026-03-22', time: '03:00 PM', status: 'completed', reason: 'Hypertension review' },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(MOCK);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getDoctorAppointments()
      .then(({ data }) => { if (data.length > 0) setAppointments(data); })
      .catch(() => {});
  }, []);

  const markComplete = async (id) => {
    try {
      await completeAppointment(id, '');
      setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: 'completed' } : a));
      setMsg('Marked as completed.');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Error updating appointment.'); }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a));
      setMsg('Appointment cancelled.');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Error cancelling appointment.'); }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.date === todayStr);
  const upcoming = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <div className="page dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dr. {user?.name?.replace('Dr. ', '')} 👨‍⚕️</h1>
          <p>Your schedule and patient appointments</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="sc-icon">🗓️</div>
          <div className="sc-value">{todayAppts.length}</div>
          <div className="sc-label">Today's Patients</div>
        </div>
        <div className="stat-card">
          <div className="sc-icon">📅</div>
          <div className="sc-value">{upcoming}</div>
          <div className="sc-label">Upcoming</div>
        </div>
        <div className="stat-card">
          <div className="sc-icon">✅</div>
          <div className="sc-value">{appointments.filter((a) => a.status === 'completed').length}</div>
          <div className="sc-label">Completed</div>
        </div>
      </div>

      {msg && <div className="success-msg">{msg}</div>}

      <div className="section-header">
        <h2>All Appointments</h2>
      </div>

      <div className="appointments-list">
        {appointments.map((apt) => (
          <div key={apt._id} className="appointment-item">
            <div className="apt-avatar" style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>
              {apt.patient?.name?.charAt(0)}
            </div>
            <div className="apt-info">
              <div className="apt-doctor">{apt.patient?.name}</div>
              <div className="apt-spec">📞 {apt.patient?.phone}</div>
              <div className="apt-reason">Reason: {apt.reason}</div>
            </div>
            <div className="apt-datetime">
              <div className="apt-date">📅 {apt.date}</div>
              <div className="apt-time">🕐 {apt.time}</div>
            </div>
            <div className="apt-status">
              <span className={`badge badge-${apt.status}`}>{apt.status}</span>
            </div>
            <div className="apt-actions" style={{ display: 'flex', gap: 8 }}>
              {apt.status === 'confirmed' && (
                <>
                  <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => markComplete(apt._id)}>Complete</button>
                  <button className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => handleCancel(apt._id)}>Cancel</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
