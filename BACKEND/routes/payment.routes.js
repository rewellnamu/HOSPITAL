const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createPayment,
  getPaymentsByPatient,
  getAllPayments
} = require('../controllers/payment.controller');

router.post('/', protect, createPayment);
router.get('/my', protect, getPaymentsByPatient);
router.get('/all', protect, getAllPayments);

module.exports = router;
