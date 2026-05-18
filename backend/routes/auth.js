const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup attempt:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Sab fields bharni zaroori hain' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    console.log('User created:', user.email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
  user: { _id: user._id, name: user.name, email: user.email, isPro: user.isPro } 
});

  } catch (err) {
    console.log('Signup Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email aur password dono chahiye' });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? user.email : 'NOT FOUND');

    if (!user) return res.status(400).json({ message: 'Email not found' });

    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);

    if (!match) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, isPro: user.isPro } });

  } catch (err) {
    console.log('Login Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;