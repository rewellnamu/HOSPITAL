const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor'); // Add this

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
  try {
    console.log('GET /appointments/my called for user:', req.user && req.user._id);
    // Find patient by user ID
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    const appointments = await Appointment.find({ patientId: patient._id })
      .populate({
        path: 'doctorId',
        select: 'specialization userId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error in getMyAppointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(appointment);
};

exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    // Find doctor profile by user ID
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate({
        path: 'patientId',
        select: 'userId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientsForDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    // Find all appointments for this doctor, populate patient info
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate({
        path: 'patientId',
        select: 'userId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .sort({ date: -1 });

    // Group by patient
    const patientMap = {};
    appointments.forEach(appt => {
      const patient = appt.patientId;
      if (!patient) return;
      const patientKey = patient._id.toString();
      if (!patientMap[patientKey]) {
        patientMap[patientKey] = {
          _id: patient._id,
          name: patient.userId?.name || '',
          userId: patient.userId?._id || patient.userId, // Ensure userId is a string
          appointments: []
        };
      }
      patientMap[patientKey].appointments.push({
        _id: appt._id,
        date: appt.date,
        time: appt.time,
        status: appt.status
      });
    });

    res.json(Object.values(patientMap));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAppointments = async (req, res) => {
  // Optionally restrict to admin: if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const appointments = await Appointment.find()
      .populate({
        path: 'patientId',
        select: 'userId',
        populate: { path: 'userId', select: 'name' }
      })
      .populate({
        path: 'doctorId',
        select: 'userId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
