const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

exports.createAppointment = async (req, res) => {
  console.log('Appointment POST body:', req.body); // Add this line
  const { doctorId, date, time, reason } = req.body;
  // Find patient by user ID
  const patient = await Patient.findOne({ userId: req.user._id });
  if (!patient) {
    return res.status(404).json({ message: 'Patient profile not found' });
  }
  // Combine date and time into a single Date object
  let dateObj;
  try {
    dateObj = new Date(`${date}T${time}:00`);
    if (isNaN(dateObj.getTime())) throw new Error('Invalid date/time');
  } catch {
    return res.status(400).json({ message: 'Invalid date or time format' });
  }
  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorId,
    date: dateObj,
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
