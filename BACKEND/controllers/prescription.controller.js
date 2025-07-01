const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient'); // Add this

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
  let patientId = req.params.id;
  if (patientId === 'me') {
    // Find patient profile by user ID
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    patientId = patient._id;
  }
  const prescriptions = await Prescription.find({ patientId })
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name'
      }
    });
  res.json(prescriptions);
};
