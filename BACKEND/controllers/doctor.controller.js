const Doctor = require('../models/Doctor');

exports.getAllDoctors = async (req, res) => {
  const doctors = await Doctor.find().populate('userId', 'name email');
  res.json(doctors);
};

exports.getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};
