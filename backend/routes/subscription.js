const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const PLAN_PRICES = { pro: 19900, premium: 29900 };

function getRazorpayKeys() {
  return {
    key_id: (process.env.RAZORPAY_KEY_ID || '').trim(),
    key_secret: (process.env.RAZORPAY_KEY_SECRET || '').trim(),
  };
}

function getRazorpay() {
  const { key_id, key_secret } = getRazorpayKeys();
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
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

    if ((process.env.RAZORPAY_SKIP || '').trim() === 'true') {
      return res.json({
        success: true,
        skipGateway: true,
        amount,
        currency: 'INR',
        planType,
      });
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
      keyId: getRazorpayKeys().key_id,
      planType,
      message: 'Complete payment via Razorpay, then call POST /api/subscription/verify',
    });
  } catch (err) {
    const description = err?.error?.description || err.message;
    if (/authentication failed/i.test(description || '')) {
      return res.status(401).json({
        message: 'Razorpay authentication failed. Open Razorpay Dashboard → Account & Settings → API Keys, copy a fresh Key ID and Key Secret into backend/.env, then restart the backend.',
      });
    }
    res.status(500).json({ message: description });
  }
});

// Verify Razorpay payment and tie it to the authenticated user
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({ message: 'Payment gateway not configured' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', getRazorpayKeys().key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    if (!order) {
      return res.status(400).json({ message: 'Order not found' });
    }

    const orderOwner = order.notes?.userId;
    if (!orderOwner || orderOwner !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Payment does not belong to the authenticated user' });
    }

    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    await User.findByIdAndUpdate(req.user._id, {
      isPro: true,
      subscriptionEnd,
      paymentId: razorpay_payment_id,
      plan: order.notes?.plan || 'pro',
    });

    res.json({ success: true, message: 'Pro plan activated!', subscriptionEnd });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/complete-local', protect, async (req, res) => {
  try {
    if ((process.env.RAZORPAY_SKIP || '').trim() !== 'true') {
      return res.status(403).json({ message: 'Local checkout is disabled' });
    }

    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    await User.findByIdAndUpdate(req.user._id, {
      isPro: true,
      subscriptionEnd,
      paymentId: `local_${Date.now()}`,
      plan: 'pro',
    });

    res.json({ success: true, message: 'Pro plan activated!', subscriptionEnd });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
