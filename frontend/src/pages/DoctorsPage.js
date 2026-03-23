import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDoctors } from '../utils/api';
import './DoctorsPage.css';

const SPECIALIZATIONS = [
  'All', 'Cardiologist', 'Neurologist', 'Dentist', 'Ophthalmologist',
  'Orthopedic', 'Pediatrician', 'General Physician', 'Dermatologist',
];

// Mock data so the page looks great even without backend
const MOCK_DOCTORS = [
  { _id: '1', user: { name: 'Dr. Arjun Sharma' }, specialization: 'Cardiologist', experience: 12, consultationFee: 800, rating: 4.9, hospital: 'Apollo Hospital', availableSlots: [{}, {}, {}] },
  { _id: '2', user: { name: 'Dr. Priya Nair' }, specialization: 'Neurologist', experience: 8, consultationFee: 700, rating: 4.8, hospital: 'AIIMS', availableSlots: [{}, {}] },
  { _id: '3', user: { name: 'Dr. Ravi Menon' }, specialization: 'Orthopedic', experience: 15, consultationFee: 600, rating: 4.7, hospital: 'Fortis Hospital', availableSlots: [{}, {}, {}, {}] },
  { _id: '4', user: { name: 'Dr. Sneha Patel' }, specialization: 'Dermatologist', experience: 6, consultationFee: 500, rating: 4.6, hospital: 'Max Hospital', availableSlots: [{}] },
  { _id: '5', user: { name: 'Dr. Kiran Das' }, specialization: 'Pediatrician', experience: 10, consultationFee: 550, rating: 4.9, hospital: 'Care Hospital', availableSlots: [{}, {}] },
  { _id: '6', user: { name: 'Dr. Anjali Mehta' }, specialization: 'General Physician', experience: 5, consultationFee: 400, rating: 4.5, hospital: 'City Clinic', availableSlots: [{}, {}, {}] },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const spec = searchParams.get('specialization');
    if (spec) setSelectedSpec(spec);

    getDoctors().then(({ data }) => {
      if (data.length > 0) setDoctors(data);
    }).catch(() => {});
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSpec = selectedSpec === 'All' || d.specialization === selectedSpec;
    const matchSearch = d.user.name.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <div className="page doctors-page">
      <div className="doctors-header">
        <h1>Find Your Doctor</h1>
        <p>Browse from our network of verified, experienced doctors</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          placeholder="🔍  Search by doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="spec-filters">
          {SPECIALIZATIONS.map((s) => (
            <button
              key={s}
              className={`spec-btn ${selectedSpec === s ? 'active' : ''}`}
              onClick={() => setSelectedSpec(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="doctors-count">{filtered.length} doctors found</div>
      <div className="doctors-grid">
        {filtered.map((doc) => (
          <div key={doc._id} className="doctor-card">
            <div className="doctor-avatar">
              {doc.user.name.charAt(3).toUpperCase()}
            </div>
            <div className="doctor-info">
              <h3>{doc.user.name}</h3>
              <div className="doctor-spec">{doc.specialization}</div>
              <div className="doctor-hospital">🏥 {doc.hospital}</div>
              <div className="doctor-meta">
                <span>🏆 {doc.experience} yrs exp</span>
                <span>⭐ {doc.rating}</span>
                <span>📅 {doc.availableSlots?.length || 0} slots</span>
              </div>
              <div className="doctor-fee">₹{doc.consultationFee} / consultation</div>
              <Link to={`/doctors/${doc._id}`} className="btn btn-primary book-btn">
                Book Appointment →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <div style={{ fontSize: '3rem' }}>🔍</div>
          <p>No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
