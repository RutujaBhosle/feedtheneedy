const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/volunteers', async (req, res) => {
  try {
    console.log('Fetching volunteers from DB...')
    const volunteers = await User.find({ role: 'volunteer' }).select('-password')
    console.log('Found volunteers:', volunteers.length)
    res.json(volunteers);
  } catch (err) {
    console.error('Volunteers route error:', err.message)
    res.status(500).json({ message: err.message });
  }
});

router.get('/ngos', async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' }).select('-password');
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, area } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, phone, area }, { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;