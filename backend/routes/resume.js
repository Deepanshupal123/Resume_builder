const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// CREATE resume
router.post('/create', protect, async (req, res) => {
  try {
    const { title, template, data } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const resume = await Resume.create({
      userId: req.user._id,
      title,
      template: template || 'classic',
      data: data || {},
    });

    res.status(201).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LIST resumes
router.get('/list', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, resumes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AI generate (existing)
router.post('/generate', async (req, res) => {
  try {
    const {
      name, email, phone, summary, skills,
      jobTitle, company, years, jobDesc,
      college, degree, gradYear,
    } = req.body;

    const prompt = `
You are a professional resume writer. Create a clean, ATS-friendly resume.

Personal Info:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Skills: ${skills}

Work Experience:
- Job Title: ${jobTitle}
- Company: ${company}
- Experience: ${years}
- Work Done: ${jobDesc}

Education:
- College: ${college}
- Degree: ${degree}
- Graduation Year: ${gradYear}

Summary: ${summary || 'Generate a professional summary based on above details'}

Format with these sections:
1. PROFESSIONAL SUMMARY
2. SKILLS
3. WORK EXPERIENCE
4. EDUCATION

Make it professional, ATS-friendly. Use action verbs. Return plain text only.
`;

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    res.json({ success: true, resume: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single resume
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE resume
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, template, data } = req.body;
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...(title && { title }), ...(template && { template }), ...(data && { data }) },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE resume
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
