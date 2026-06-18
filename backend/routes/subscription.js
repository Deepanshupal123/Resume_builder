const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const PLAN_PRICES = { pro: 19900, premium: 29900 };

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// GET subscription status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();
    const isActive = user.isPro && user.subscriptionEnd && new Date(user.subscriptionEnd) > now;

    if (user.isPro && !isActive) {
      await User.findByIdAndUpdate(req.user._id, { isPro: false });
    }

    res.json({
      success: true,
      plan: user.plan,
      isPro: isActive,
      subscriptionEnd: user.subscriptionEnd || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST upgrade subscription
router.post('/upgrade', protect, async (req, res) => {
  try {
    const { planType = 'pro' } = req.body;
    const amount = PLAN_PRICES[planType];
    if (!amount) {
      return res.status(400).json({ message: 'Invalid planType. Use "pro" or "premium".' });
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({ message: 'Payment gateway not configured' });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `sub_${Date.now()}`,
      notes: { userId: req.user._id.toString(), plan: planType },
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planType,
      message: 'Complete payment via Razorpay, then call POST /api/payment/verify',
    });
  } catch (err) {
    res.status(500).json({ message: err?.error?.description || err.message });
  }
});

module.exports = router;
