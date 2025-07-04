const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient'); // Add this

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc   Register a new user
// @route  POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, licenseNumber, qualifications, availableDays, availableTimeSlots, bio } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // If role is doctor, also create Doctor document
    if (role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialization: specialization || '',
        licenseNumber: licenseNumber || '',
        qualifications: qualifications || [],
        availableDays: availableDays || [],
        availableTimeSlots: availableTimeSlots || [],
        bio: bio || ''
      });
    }

    // If role is patient, also create Patient document
    if (role === 'patient') {
      await Patient.create({
        userId: user._id
        // You can add more fields if needed
      });
    }

    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Login a user
// @route  POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
