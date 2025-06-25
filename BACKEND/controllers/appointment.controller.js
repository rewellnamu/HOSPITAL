const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

exports.createAppointment = async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  // Find patient by user ID
  const patient = await Patient.findOne({ userId: req.user._id });
  if (!patient) {
    return res.status(404).json({ message: 'Patient profile not found' });
  }
  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorId,
    date,
    time,
    reason
  });
  res.status(201).json(appointment);
};

exports.getMyAppointments = async (req, res) => {
  // Find patient by user ID
  const patient = await Patient.findOne({ userId: req.user._id });
  if (!patient) {
    return res.status(404).json({ message: 'Patient profile not found' });
  }
  const appointments = await Appointment.find({ patientId: patient._id })
    .populate('doctorId', 'specialization userId')
    .sort({ date: -1 });
  res.json(appointments);
};

exports.updateAppointmentStatus = async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(appointment);
};
