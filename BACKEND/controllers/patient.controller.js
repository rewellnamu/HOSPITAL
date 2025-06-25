const Patient = require('../models/Patient');

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
