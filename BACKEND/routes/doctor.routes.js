const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getAllDoctors,
  getDoctorById
} = require('../controllers/doctor.controller');

router.get('/', protect, getAllDoctors);
router.get('/:id', protect, getDoctorById);

module.exports = router;
