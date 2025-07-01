const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getMe } = require('../controllers/user.controller');
const User = require('../models/User');

// @route   GET /api/users/me
router.get('/me', protect, getMe);

// @route   GET /api/users/all
router.get('/all', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const users = await User.find().select('-password');
  res.json(users);
});

// @route   DELETE /api/users/:id
router.delete('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;
