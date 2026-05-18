const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'free' },

  // ── Subscription fields ──────────────────────────────────────
  isPro: { type: Boolean, default: false },
  subscriptionEnd: { type: Date, default: null },
  paymentId: { type: String, default: null }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
