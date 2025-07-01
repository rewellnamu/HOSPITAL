const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getPatientProfile,
  updatePatientProfile,
  getAllPatients // Add this
} = require('../controllers/patient.controller');

router.get('/profile', protect, getPatientProfile);
router.put('/profile', protect, updatePatientProfile);

// Add this route for doctors/admins
router.get('/', protect, getAllPatients);

module.exports = router;
