const User = require('../models/User');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findUserByEmail(email) {
  const normalized = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalized });
  if (!user) {
    user = await User.findOne({
      email: { $regex: new RegExp(`^${escapeRegex(normalized)}$`, 'i') },
    });
  }
  return user;
}

module.exports = { findUserByEmail };
