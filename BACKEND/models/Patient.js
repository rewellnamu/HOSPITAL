const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gender: String,
  dateOfBirth: Date,
  bloodType: String,
  allergies: [String],
  medicalHistory: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
