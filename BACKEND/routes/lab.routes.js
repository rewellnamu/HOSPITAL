const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  uploadLabResult,
  getLabResultsForPatient
} = require('../controllers/lab.controller');

router.post('/', protect, uploadLabResult);
router.get('/patient/:id', protect, getLabResultsForPatient);

module.exports = router;
