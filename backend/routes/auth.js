const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const { sendResetEmail } = require('../utils/sendResetEmail');
const { findUserByEmail } = require('../utils/findUserByEmail');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup attempt:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Sab fields bharni zaroori hain' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, password: hashed });
    console.log('User created:', user.email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, isPro: user.isPro },
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

    const user = await findUserByEmail(email);
    console.log('User found:', user ? user.email : 'NOT FOUND');

    if (!user) return res.status(400).json({ message: 'Email not found' });

    if (!user.password) {
      return res.status(400).json({ message: 'This account uses Google login. Sign in with Google instead.' });
    }

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
router.post('/google', async (req, res) => {

  try {

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: 'Google token missing',
      });
    }

    // VERIFY TOKEN WITH GOOGLE
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      name,
      email,
      picture,
    } = payload;

    // CHECK USER EXISTS
    let user = await findUserByEmail(email);

    // CREATE USER IF NOT EXISTS
    if (!user) {

      user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password: '',
        picture,
      });
    }

    // CREATE JWT
    const appToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: appToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isPro: user.isPro,
      },
    });

  } catch (err) {

    console.log('Google Auth Error:', err);

    res.status(500).json({
      message: 'Google authentication failed',
    });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Forgot-password request body:', req.body);

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been generated.' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'This account uses Google login. Sign in with Google instead.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    let mailResult;
    try {
      mailResult = await sendResetEmail(user.email, resetUrl);
    } catch (err) {
      console.log('Error sending reset email:', err);
      return res.status(200).json({
        message: 'Could not send email. Use the reset link below.',
        resetUrl,
      });
    }

    return res.status(200).json({
      message: mailResult.fallback
        ? 'Reset link generated. Configure SMTP to send email automatically.'
        : 'Reset link sent to your email address.',
      resetUrl: mailResult.resetUrl || null,
    });
  } catch (err) {
    console.log('Forgot Password Error:', err);
    const devMessage = process.env.NODE_ENV === 'development' ? `Unable to process password reset request: ${err.message}` : 'Unable to process password reset request.';
    return res.status(500).json({ message: devMessage });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or expired.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.log('Reset Password Error:', err.message);
    return res.status(500).json({ message: 'Unable to reset password.' });
  }
});

module.exports = router;