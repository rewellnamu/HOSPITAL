const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  prescribedAt: { type: Date, default: Date.now },
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }
  ],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
