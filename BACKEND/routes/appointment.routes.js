const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  getAppointmentsForDoctor,
  getPatientsForDoctor,
  getAllAppointments // Add this
} = require('../controllers/appointment.controller');

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.patch('/:id/status', protect, updateAppointmentStatus);
router.get('/doctor', protect, getAppointmentsForDoctor);
router.get('/doctor/patients', protect, getPatientsForDoctor);
router.get('/all', protect, getAllAppointments); // Add this line

module.exports = router;
