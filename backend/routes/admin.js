const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { protect, adminOnly } = require('../middleware/auth');

// @route GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [totalPatients, totalDoctors, totalAppointments, todayAppointments] =
      await Promise.all([
        User.countDocuments({ role: 'patient' }),
        User.countDocuments({ role: 'doctor' }),
        Appointment.countDocuments(),
        Appointment.countDocuments({ date: today }),
      ]);

    res.json({ totalPatients, totalDoctors, totalAppointments, todayAppointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/admin/appointments
router.get('/appointments', protect, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/admin/doctors
router.get('/doctors', protect, adminOnly, async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email phone');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
