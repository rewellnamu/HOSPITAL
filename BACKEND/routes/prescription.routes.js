const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createPrescription,
  getPrescriptionsForPatient
} = require('../controllers/prescription.controller');

router.post('/', protect, createPrescription);
router.get('/patient/:id', protect, getPrescriptionsForPatient);

module.exports = router;
