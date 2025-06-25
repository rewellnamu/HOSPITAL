const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus
} = require('../controllers/appointment.controller');

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.patch('/:id/status', protect, updateAppointmentStatus);

module.exports = router;
