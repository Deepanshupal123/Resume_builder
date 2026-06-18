const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB Error:', err.message));

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const aiRoutes = require('./routes/ai');
const paymentRoutes = require('./routes/payment');
const analysisRoutes = require('./routes/analysis');
const userRoutes = require('./routes/user');
const subscriptionRoutes = require('./routes/subscription');
const templateRoutes = require('./routes/templates');
const exportRoutes = require('./routes/export');

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/export', exportRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ResumeAI backend running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));