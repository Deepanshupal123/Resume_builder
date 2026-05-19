const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT SET');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_SrAqROP3AZEDZT',
  key_secret: 'UPU2b5PhCvup5VfClIP9Xq7d'
});
// ── User Model (subscription field add) ──────────────────────────────────────
const User = require('../models/User');

// ── Route 1: Create Order ─────────────────────────────────────────────────────
router.post('/create-order', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const options = {
      amount: 19900, // ₹199 in paise
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        plan: 'pro_monthly'
      }
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Route 2: Verify Payment ───────────────────────────────────────────────────
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    // Signature verify karo
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', 'UPU2b5PhCvup5VfClIP9Xq7d')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // User ko Pro upgrade karo
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); // 1 month

    await User.findByIdAndUpdate(userId, {
      isPro: true,
      subscriptionEnd: subscriptionEnd,
      paymentId: razorpay_payment_id
    });

    res.json({
      success: true,
      message: 'Payment verified! Pro plan activated.',
      subscriptionEnd: subscriptionEnd
    });
  } catch (err) {
    console.error('Verify payment error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Route 3: Check Subscription Status ───────────────────────────────────────
router.get('/status/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const isActive = user.isPro && user.subscriptionEnd && new Date(user.subscriptionEnd) > now;

    // Expired ho gaya toh reset karo
    if (user.isPro && !isActive) {
      await User.findByIdAndUpdate(req.params.userId, { isPro: false });
    }

    res.json({
      isPro: isActive,
      subscriptionEnd: user.subscriptionEnd || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
