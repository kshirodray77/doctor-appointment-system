const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');
const { sendConfirmationEmail } = require('../config/mailer');

// @route POST /api/appointments
// Book an appointment
router.post('/', protect, async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  try {
    const doctor = await Doctor.findById(doctorId).populate('user', 'name');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Mark slot as booked
    const slot = doctor.availableSlots.find(
      (s) => s.date === date && s.time === time && !s.isBooked
    );
    if (!slot) return res.status(400).json({ message: 'Slot not available' });

    slot.isBooked = true;
    await doctor.save();

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
    });

    // Send confirmation email
    await sendConfirmationEmail({
      to: req.user.email,
      patientName: req.user.name,
      doctorName: doctor.user.name,
      date,
      time,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/appointments/my
// Patient's appointments
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/appointments/doctor
// Doctor's appointments
router.get('/doctor', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/appointments/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'cancelled';
    await appointment.save();

    // Free up the slot
    const doctor = await Doctor.findById(appointment.doctor);
    const slot = doctor.availableSlots.find(
      (s) => s.date === appointment.date && s.time === appointment.time
    );
    if (slot) { slot.isBooked = false; await doctor.save(); }

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/appointments/:id/complete
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'completed';
    appointment.notes = req.body.notes || '';
    await appointment.save();

    res.json({ message: 'Appointment marked as completed', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
