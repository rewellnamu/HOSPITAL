const Prescription = require('../models/Prescription');

exports.createPrescription = async (req, res) => {
  const { appointmentId, patientId, medications, notes } = req.body;
  const prescription = await Prescription.create({
    appointmentId,
    doctorId: req.user._id,
    patientId,
    medications,
    notes
  });
  res.status(201).json(prescription);
};

exports.getPrescriptionsForPatient = async (req, res) => {
  const prescriptions = await Prescription.find({ patientId: req.params.id });
  res.json(prescriptions);
};
