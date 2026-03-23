import React, { useState, useEffect } from 'react';
import { getAdminStats, getAllAppointments } from '../utils/api';
import './Dashboard.css';

const MOCK_STATS = { totalPatients: 248, totalDoctors: 18, totalAppointments: 512, todayAppointments: 14 };
const MOCK_APPTS = [
  { _id: 'x1', patient: { name: 'Rahul Verma' }, doctor: { user: { name: 'Dr. Arjun Sharma' } }, date: '2026-03-23', time: '09:00 AM', status: 'confirmed' },
  { _id: 'x2', patient: { name: 'Sunita Roy' }, doctor: { user: { name: 'Dr. Priya Nair' } }, date: '2026-03-23', time: '11:30 AM', status: 'completed' },
  { _id: 'x3', patient: { name: 'Aman Singh' }, doctor: { user: { name: 'Dr. Sneha Patel' } }, date: '2026-03-22', time: '03:00 PM', status: 'cancelled' },
  { _id: 'x4', patient: { name: 'Meena Joshi' }, doctor: { user: { name: 'Dr. Ravi Menon' } }, date: '2026-03-22', time: '04:30 PM', status: 'confirmed' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [appointments, setAppointments] = useState(MOCK_APPTS);

  useEffect(() => {
    getAdminStats().then(({ data }) => setStats(data)).catch(() => {});
    getAllAppointments().then(({ data }) => { if (data.length > 0) setAppointments(data); }).catch(() => {});
  }, []);

  return (
    <div className="page dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of all appointments and system activity</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 36 }}>
        {[
          { icon: '👥', value: stats.totalPatients, label: 'Total Patients', color: '#0f766e' },
          { icon: '👨‍⚕️', value: stats.totalDoctors, label: 'Total Doctors', color: '#7c3aed' },
          { icon: '📅', value: stats.totalAppointments, label: 'Total Appointments', color: '#0369a1' },
          { icon: '🗓️', value: stats.todayAppointments, label: "Today's Bookings", color: '#b45309' },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-value" style={{ color: s.color }}>{s.value}</div>
            <div className="sc-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* All appointments table */}
      <div className="card">
        <h2 style={{ marginBottom: 20 }}>Recent Appointments</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.name}</td>
                  <td>{a.doctor?.user?.name}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
