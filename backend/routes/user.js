const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpires');
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        plan: user.plan,
        isPro: user.isPro,
        subscriptionEnd: user.subscriptionEnd,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST change password
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user.password) {
      return res.status(400).json({ message: 'Password login not set for this account' });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
