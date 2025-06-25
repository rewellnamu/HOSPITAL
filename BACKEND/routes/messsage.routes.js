const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  sendMessage,
  getMessages
} = require('../controllers/message.controller');

router.post('/', protect, sendMessage);
router.get('/:receiverId', protect, getMessages);

module.exports = router;
