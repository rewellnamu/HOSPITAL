const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    if (!receiverId || !message) {
      return res.status(400).json({ message: 'receiverId and message are required' });
    }
    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message
    });
    // Populate sender and receiver for immediate feedback
    const populated = await Message.findById(newMessage._id)
      .populate('senderId', 'name')
      .populate('receiverId', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Error in sendMessage:', err);
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: req.params.receiverId },
      { senderId: req.params.receiverId, receiverId: req.user._id }
    ]
  })
    .sort({ timestamp: 1 })
    .populate('senderId', 'name')
    .populate('receiverId', 'name');
  res.json(messages);
};

// Get all messages for the current user (for LabResults/messages inbox)
exports.getAllMessagesForUser = async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id },
      { receiverId: req.user._id }
    ]
  })
    .sort({ timestamp: -1 })
    .populate('senderId', 'name')
    .populate('receiverId', 'name');
  res.json(messages);
};
