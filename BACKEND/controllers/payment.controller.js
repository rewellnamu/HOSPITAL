const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  const { appointmentId, amount, paymentMethod } = req.body;
  const payment = await Payment.create({
    patientId: req.user._id,
    appointmentId,
    amount,
    paymentMethod,
    status: 'paid',
    paidAt: new Date()
  });
  res.status(201).json(payment);
};

exports.getPaymentsByPatient = async (req, res) => {
  const payments = await Payment.find({ patientId: req.user._id }).sort({ paidAt: -1 });
  res.json(payments);
};
