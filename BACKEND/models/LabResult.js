const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  testName: String,
  result: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
  documentUrl: String
}, { timestamps: true });

module.exports = mongoose.model('LabResult', labResultSchema);
