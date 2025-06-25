const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;
  const newMessage = await Message.create({
    senderId: req.user._id,
    receiverId,
    message
  });
  res.status(201).json(newMessage);
};

exports.getMessages = async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: req.params.receiverId },
      { senderId: req.params.receiverId, receiverId: req.user._id }
    ]
  }).sort({ timestamp: 1 });
  res.json(messages);
};
