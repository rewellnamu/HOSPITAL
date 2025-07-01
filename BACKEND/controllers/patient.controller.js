const Patient = require('../models/Patient');
const User = require('../models/User'); // Add this

exports.getPatientProfile = async (req, res) => {
  const patient = await Patient.findOne({ userId: req.user._id });
  res.json(patient);
};

exports.updatePatientProfile = async (req, res) => {
  const updated = await Patient.findOneAndUpdate(
    { userId: req.user._id },
    { $set: req.body },
    { new: true }
  );
  res.json(updated);
};

exports.getAllPatients = async (req, res) => {
  // Optionally restrict to doctor/admin: if (req.user.role !== 'doctor' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const patients = await Patient.find().populate('userId', 'name email gender dateOfBirth phone');
  res.json(patients);
};
