import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const specializations = [
  { icon: '🫀', name: 'Cardiologist' },
  { icon: '🧠', name: 'Neurologist' },
  { icon: '🦷', name: 'Dentist' },
  { icon: '👁️', name: 'Ophthalmologist' },
  { icon: '🦴', name: 'Orthopedic' },
  { icon: '🧒', name: 'Pediatrician' },
  { icon: '🩺', name: 'General Physician' },
  { icon: '🌿', name: 'Dermatologist' },
];

export default function HomePage() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Trusted Healthcare Platform</span>
          <h1>Book Doctor Appointments <span>Instantly</span></h1>
          <p>Connect with top-rated doctors near you. Choose a time that works for you and get email confirmation within seconds.</p>
          <div className="hero-actions">
            <Link to="/doctors" className="btn btn-primary">Find a Doctor →</Link>
            <Link to="/register" className="btn btn-outline">Create Account</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <div className="hc-avatar">👨‍⚕️</div>
            <div>
              <div className="hc-name">Dr. Arjun Sharma</div>
              <div className="hc-spec">Cardiologist · 12 yrs exp</div>
            </div>
            <div className="hc-rating">⭐ 4.9</div>
          </div>
          <div className="hero-card hero-card-2">
            <div className="hc-avatar">👩‍⚕️</div>
            <div>
              <div className="hc-name">Dr. Priya Nair</div>
              <div className="hc-spec">Neurologist · 8 yrs exp</div>
            </div>
            <div className="hc-rating">⭐ 4.8</div>
          </div>
          <div className="hero-stat-pill">✅ 2,400+ appointments booked</div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2>How MediBook Works</h2>
        <div className="steps">
          {[
            { step: '01', icon: '🔍', title: 'Search Doctors', desc: 'Browse by specialization, name, or availability' },
            { step: '02', icon: '📅', title: 'Pick a Slot', desc: 'Choose a date and time that fits your schedule' },
            { step: '03', icon: '✅', title: 'Get Confirmed', desc: 'Receive instant email confirmation of your booking' },
          ].map((s) => (
            <div className="step-card" key={s.step}>
              <div className="step-number">{s.step}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section className="specializations">
        <h2>Browse by Specialization</h2>
        <div className="spec-grid">
          {specializations.map((s) => (
            <Link to={`/doctors?specialization=${s.name}`} key={s.name} className="spec-card">
              <span className="spec-icon">{s.icon}</span>
              <span>{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        {[
          { value: '150+', label: 'Verified Doctors' },
          { value: '20+', label: 'Specializations' },
          { value: '5,000+', label: 'Happy Patients' },
          { value: '4.9★', label: 'Average Rating' },
        ].map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
