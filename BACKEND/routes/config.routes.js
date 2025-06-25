const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getHospitalConfig,
  updateHospitalConfig
} = require('../controllers/config.controller');

router.get('/', protect, getHospitalConfig);
router.put('/', protect, updateHospitalConfig);

module.exports = router;
