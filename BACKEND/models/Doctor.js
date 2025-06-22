const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: String,
  licenseNumber: String,
  qualifications: [String],
  availableDays: [String], // e.g. ["Monday", "Wednesday"]
  availableTimeSlots: [String], // e.g. ["09:00", "10:30"]
  bio: String
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
