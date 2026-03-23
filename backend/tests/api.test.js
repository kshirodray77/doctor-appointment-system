/**
 * API Test Suite — MediBook Backend
 * Run: npm test
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server.test-app');

let patientToken, doctorToken, adminToken;
let doctorId, appointmentId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/medibook_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('registers a new patient', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Patient',
      email: 'patient_test@medibook.com',
      password: 'test1234',
      role: 'patient',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.role).toBe('patient');
    patientToken = res.body.token;
  });

  it('registers a new doctor', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Dr. Test',
      email: 'doctor_test@medibook.com',
      password: 'test1234',
      role: 'doctor',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.role).toBe('doctor');
    doctorToken = res.body.token;
  });

  it('registers admin', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Admin Test',
      email: 'admin_test@medibook.com',
      password: 'test1234',
      role: 'admin',
    });
    expect(res.statusCode).toBe(201);
    adminToken = res.body.token;
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Duplicate',
      email: 'patient_test@medibook.com',
      password: 'test1234',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already registered/i);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'patient_test@medibook.com',
      password: 'test1234',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'patient_test@medibook.com',
      password: 'wrongpass',
    });
    expect(res.statusCode).toBe(401);
  });

  it('rejects non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@medibook.com',
      password: 'anything',
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns current user when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${patientToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('patient_test@medibook.com');
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});

// ─── DOCTORS ──────────────────────────────────────────────────────────────────

describe('GET /api/doctors', () => {
  it('returns list of doctors', async () => {
    const res = await request(app).get('/api/doctors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('filters by specialization', async () => {
    const res = await request(app).get('/api/doctors?specialization=Cardiologist');
    expect(res.statusCode).toBe(200);
    res.body.forEach((d) => expect(d.specialization).toBe('Cardiologist'));
  });
});

describe('POST /api/doctors/slots', () => {
  it.skip('allows doctor to add slots', async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const res = await request(app)
      .post('/api/doctors/slots')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ slots: [{ date: tomorrow, time: '10:00 AM' }, { date: tomorrow, time: '02:00 PM' }] });
    expect(res.statusCode).toBe(200);
    expect(res.body.availableSlots.length).toBeGreaterThan(0);
  });

  it('blocks patient from adding slots', async () => {
    const res = await request(app)
      .post('/api/doctors/slots')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ slots: [{ date: '2026-04-01', time: '10:00 AM' }] });
    expect(res.statusCode).toBe(403);
  });
});

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

describe('POST /api/appointments', () => {
  it('books appointment successfully', async () => {
    // Get a doctor with slots first
    const doctors = await request(app).get('/api/doctors');
    if (doctors.body.length === 0) return;

    const doc = doctors.body[0];
    doctorId = doc._id;
    const slots = await request(app).get(`/api/doctors/${doc._id}/slots`);
    if (slots.body.length === 0) return;

    const slot = slots.body[0];
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ doctorId: doc._id, date: slot.date, time: slot.time, reason: 'Test booking' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.status).toBe('confirmed');
    appointmentId = res.body._id;
  });

  it('requires authentication', async () => {
    const res = await request(app).post('/api/appointments').send({ doctorId: 'x', date: 'x', time: 'x' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/appointments/my', () => {
  it('returns patient appointments', async () => {
    const res = await request(app)
      .get('/api/appointments/my')
      .set('Authorization', `Bearer ${patientToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('PUT /api/appointments/:id/cancel', () => {
  it('cancels an appointment', async () => {
    if (!appointmentId) return;
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/cancel`)
      .set('Authorization', `Bearer ${patientToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.appointment.status).toBe('cancelled');
  });
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

describe('GET /api/admin/stats', () => {
  it('returns stats for admin', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalPatients');
    expect(res.body).toHaveProperty('totalDoctors');
    expect(res.body).toHaveProperty('totalAppointments');
    expect(res.body).toHaveProperty('todayAppointments');
  });

  it('blocks non-admin from stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${patientToken}`);
    expect(res.statusCode).toBe(403);
  });
});

describe('GET /api/admin/appointments', () => {
  it('returns all appointments for admin', async () => {
    const res = await request(app)
      .get('/api/admin/appointments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
