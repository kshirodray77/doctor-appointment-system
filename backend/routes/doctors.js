const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { protect, doctorOnly } = require('../middleware/auth');

// @route GET /api/doctors
// Get all doctors with optional filters
router.get('/', async (req, res) => {
  try {
    const { specialization, name } = req.query;
    let query = {};

    if (specialization) query.specialization = new RegExp(specialization, 'i');

    let doctors = await Doctor.find(query).populate('user', 'name email phone avatar');

    if (name) {
      doctors = doctors.filter((d) =>
        d.user.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/doctors/:id
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatar');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/doctors/slots
// Doctor adds available slots
router.post('/slots', protect, doctorOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const { slots } = req.body; // [{ date, time }]
    doctor.availableSlots.push(...slots);
    await doctor.save();

    res.json({ message: 'Slots added successfully', availableSlots: doctor.availableSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/doctors/:id/slots
// Get available slots for a doctor
router.get('/:id/slots', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const availableSlots = doctor.availableSlots.filter((s) => !s.isBooked);
    res.json(availableSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
