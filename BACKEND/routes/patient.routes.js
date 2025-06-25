const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getPatientProfile,
  updatePatientProfile
} = require('../controllers/patient.controller');

router.get('/profile', protect, getPatientProfile);
router.put('/profile', protect, updatePatientProfile);

module.exports = router;
