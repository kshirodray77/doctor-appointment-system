import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, getDoctorSlots, bookAppointment } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './DoctorDetailPage.css';

const MOCK_DOCTOR = {
  _id: '1',
  user: { name: 'Dr. Arjun Sharma', email: 'arjun@medibook.com' },
  specialization: 'Cardiologist',
  experience: 12,
  consultationFee: 800,
  rating: 4.9,
  hospital: 'Apollo Hospital, Delhi',
  bio: 'Dr. Arjun Sharma is a senior cardiologist with over 12 years of experience treating complex cardiovascular conditions. He completed his MD from AIIMS and fellowship from Harvard Medical School.',
  qualifications: ['MBBS - AIIMS Delhi', 'MD Cardiology - PGI Chandigarh', 'Fellowship - Harvard Medical School'],
};

const MOCK_SLOTS = [
  { _id: 's1', date: '2026-03-25', time: '09:00 AM' },
  { _id: 's2', date: '2026-03-25', time: '10:00 AM' },
  { _id: 's3', date: '2026-03-26', time: '11:30 AM' },
  { _id: 's4', date: '2026-03-26', time: '02:00 PM' },
  { _id: 's5', date: '2026-03-27', time: '04:00 PM' },
];

export default function DoctorDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(MOCK_DOCTOR);
  const [slots, setSlots] = useState(MOCK_SLOTS);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoctorById(id).then(({ data }) => setDoctor(data)).catch(() => {});
    getDoctorSlots(id).then(({ data }) => { if (data.length > 0) setSlots(data); }).catch(() => {});
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!selectedSlot) return setMsg({ text: 'Please select a time slot.', type: 'error' });

    setLoading(true);
    try {
      await bookAppointment({ doctorId: id, date: selectedSlot.date, time: selectedSlot.time, reason });
      setMsg({ text: '🎉 Appointment booked! Confirmation email sent.', type: 'success' });
      setSlots((prev) => prev.filter((s) => s._id !== selectedSlot._id));
      setSelectedSlot(null);
      setReason('');
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Booking failed. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="page detail-page">
      <div className="detail-grid">
        {/* Doctor Profile */}
        <div>
          <div className="card doctor-profile-card">
            <div className="profile-avatar">
              {doctor.user?.name?.charAt(3)}
            </div>
            <h2>{doctor.user?.name}</h2>
            <div className="profile-spec">{doctor.specialization}</div>
            <div className="profile-hospital">🏥 {doctor.hospital}</div>

            <div className="profile-stats">
              <div className="ps-item"><div className="ps-val">{doctor.experience}+</div><div className="ps-label">Years Exp.</div></div>
              <div className="ps-item"><div className="ps-val">⭐{doctor.rating}</div><div className="ps-label">Rating</div></div>
              <div className="ps-item"><div className="ps-val">₹{doctor.consultationFee}</div><div className="ps-label">Fee</div></div>
            </div>

            <div className="profile-bio">
              <h3>About</h3>
              <p>{doctor.bio}</p>
            </div>

            <div className="profile-qualifications">
              <h3>Qualifications</h3>
              <ul>
                {doctor.qualifications?.map((q) => <li key={q}>🎓 {q}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Panel */}
        <div>
          <div className="card booking-card">
            <h2>Book Appointment</h2>
            <p className="booking-subtitle">Select an available time slot below</p>

            {msg.text && <div className={msg.type === 'error' ? 'error-msg' : 'success-msg'}>{msg.text}</div>}

            {Object.keys(slotsByDate).length > 0 ? (
              Object.entries(slotsByDate).map(([date, dateSlots]) => (
                <div key={date} className="date-group">
                  <div className="date-label">📅 {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                  <div className="slots-row">
                    {dateSlots.map((slot) => (
                      <button
                        key={slot._id}
                        className={`slot-btn ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-slots">No slots available right now.</div>
            )}

            {selectedSlot && (
              <div className="booking-form">
                <div className="selected-slot-info">
                  ✅ Selected: <strong>{selectedSlot.date}</strong> at <strong>{selectedSlot.time}</strong>
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>Reason for Visit (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your symptoms or reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={handleBook} disabled={loading}>
                  {loading ? 'Booking...' : `Confirm Booking — ₹${doctor.consultationFee}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
