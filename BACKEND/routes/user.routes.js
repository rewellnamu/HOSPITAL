const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getMe } = require('../controllers/user.controller');

// @route   GET /api/users/me
router.get('/me', protect, getMe);

module.exports = router;
