const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },       // e.g. "2025-03-25"
  time: { type: String, required: true },       // e.g. "10:00 AM"
  isBooked: { type: Boolean, default: false },
});

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    qualifications: [{ type: String }],
    experience: { type: Number, default: 0 },   // years
    consultationFee: { type: Number, required: true },
    hospital: { type: String },
    bio: { type: String },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    availableSlots: [slotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
