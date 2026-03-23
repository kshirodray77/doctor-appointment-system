/**
 * Seed script — populates MongoDB with demo data
 * Run: node backend/seeder.js
 * Clear: node backend/seeder.js --clear
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medibook';

const users = [
  { name: 'Admin User',        email: 'admin@medibook.com',       password: 'admin123',   role: 'admin'   },
  { name: 'Dr. Arjun Sharma',  email: 'dr.sharma@medibook.com',   password: 'doctor123',  role: 'doctor'  },
  { name: 'Dr. Priya Nair',    email: 'dr.nair@medibook.com',     password: 'doctor123',  role: 'doctor'  },
  { name: 'Dr. Ravi Menon',    email: 'dr.menon@medibook.com',    password: 'doctor123',  role: 'doctor'  },
  { name: 'Dr. Sneha Patel',   email: 'dr.patel@medibook.com',    password: 'doctor123',  role: 'doctor'  },
  { name: 'Rahul Verma',       email: 'patient@medibook.com',     password: 'patient123', role: 'patient' },
  { name: 'Sunita Roy',        email: 'sunita@medibook.com',      password: 'patient123', role: 'patient' },
];

const doctorDetails = [
  {
    email: 'dr.sharma@medibook.com',
    specialization: 'Cardiologist',
    qualifications: ['MBBS - AIIMS Delhi', 'MD Cardiology - PGI Chandigarh', 'Fellowship - Harvard Medical School'],
    experience: 12,
    consultationFee: 800,
    hospital: 'Apollo Hospital, Delhi',
    bio: 'Senior cardiologist specializing in interventional cardiology and heart failure management.',
    rating: 4.9,
  },
  {
    email: 'dr.nair@medibook.com',
    specialization: 'Neurologist',
    qualifications: ['MBBS - CMC Vellore', 'DM Neurology - NIMHANS'],
    experience: 8,
    consultationFee: 700,
    hospital: 'AIIMS, New Delhi',
    bio: 'Neurologist with expertise in epilepsy, stroke, and movement disorders.',
    rating: 4.8,
  },
  {
    email: 'dr.menon@medibook.com',
    specialization: 'Orthopedic',
    qualifications: ['MBBS - JIPMER', 'MS Orthopedics - KEM Mumbai'],
    experience: 15,
    consultationFee: 600,
    hospital: 'Fortis Hospital, Bangalore',
    bio: 'Orthopedic surgeon with focus on joint replacement and sports injuries.',
    rating: 4.7,
  },
  {
    email: 'dr.patel@medibook.com',
    specialization: 'Dermatologist',
    qualifications: ['MBBS - B.J. Medical College', 'MD Dermatology - Grant Medical College'],
    experience: 6,
    consultationFee: 500,
    hospital: 'Max Hospital, Mumbai',
    bio: 'Dermatologist specializing in cosmetic dermatology, acne, and skin allergy.',
    rating: 4.6,
  },
];

// Generate slots for next 7 days
const generateSlots = () => {
  const slots = [];
  const times = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];
  for (let d = 1; d <= 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    // Pick 3 random times per day
    const dayTimes = times.sort(() => 0.5 - Math.random()).slice(0, 3);
    dayTimes.forEach((time) => slots.push({ date: dateStr, time, isBooked: false }));
  }
  return slots;
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    if (process.argv[2] === '--clear') {
      await Promise.all([User.deleteMany(), Doctor.deleteMany(), Appointment.deleteMany()]);
      console.log('🗑️  Database cleared');
      process.exit(0);
    }

    // Clear existing
    await Promise.all([User.deleteMany(), Doctor.deleteMany(), Appointment.deleteMany()]);

    // Create users (password hashing handled by pre-save hook)
    const createdUsers = await User.insertMany(
      await Promise.all(users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) })))
    );
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create doctor profiles
    const doctorDocs = await Promise.all(
      doctorDetails.map(async ({ email, ...details }) => {
        const user = createdUsers.find((u) => u.email === email);
        return Doctor.create({ user: user._id, ...details, availableSlots: generateSlots() });
      })
    );
    console.log(`👨‍⚕️ Created ${doctorDocs.length} doctor profiles`);

    // Create sample appointments
    const patient = createdUsers.find((u) => u.email === 'patient@medibook.com');
    const appointments = [
      {
        patient: patient._id,
        doctor: doctorDocs[0]._id,
        date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        time: '10:00 AM',
        reason: 'Annual cardiac checkup',
        status: 'confirmed',
      },
      {
        patient: patient._id,
        doctor: doctorDocs[1]._id,
        date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        time: '02:00 PM',
        reason: 'Migraine consultation',
        status: 'completed',
        notes: 'Prescribed Sumatriptan 50mg. Follow up in 4 weeks.',
      },
    ];
    await Appointment.insertMany(appointments);
    console.log(`📅 Created ${appointments.length} sample appointments`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Demo Credentials:');
    console.log('  Admin:   admin@medibook.com   / admin123');
    console.log('  Doctor:  dr.sharma@medibook.com / doctor123');
    console.log('  Patient: patient@medibook.com  / patient123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
