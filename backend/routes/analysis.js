const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');
const { callGroq, resumeDataToText } = require('../utils/groq');

// GET analysis for saved resume
router.get('/:resumeId', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const resumeText = resumeDataToText(resume.data);
    if (!resumeText.trim()) {
      return res.status(400).json({ message: 'Resume has no content to analyze' });
    }

    const prompt = `Analyze this resume and return ONLY valid JSON.

RESUME:
${resumeText.substring(0, 5000)}

Return ONLY this JSON:
{
  "overallScore": <0-100>,
  "atsScore": <0-100>,
  "contentScore": <0-100>,
  "formatScore": <0-100>,
  "strengths": ["s1","s2","s3"],
  "missingKeywords": ["k1","k2","k3"],
  "sections": {
    "experience": { "score": <number>, "feedback": "text" },
    "skills": { "score": <number>, "feedback": "text" },
    "education": { "score": <number>, "feedback": "text" },
    "summary": { "score": <number>, "feedback": "text" }
  },
  "improvements": [{ "title": "t", "detail": "d" }],
  "verdict": "text"
}`;

    const rawText = await callGroq(prompt, 1400);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);

    res.json({ success: true, resumeId: resume._id, analysis });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Analysis failed' });
  }
});

// POST keyword match
router.post('/keywords', protect, async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: 'resumeId and jobDescription are required' });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const resumeText = resumeDataToText(resume.data);
    const prompt = `Compare resume vs job description. Return ONLY JSON.

RESUME:
${resumeText.substring(0, 2000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 1000)}

{
  "matchScore": <0-100>,
  "matchedKeywords": ["k1","k2"],
  "missingKeywords": ["k1","k2"],
  "matchedSkills": ["s1","s2"],
  "missingSkills": ["s1","s2"],
  "suggestions": ["s1","s2"]
}`;

    const rawText = await callGroq(prompt, 800);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);

    res.json({ success: true, resumeId, ...result });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Keyword analysis failed' });
  }
});

module.exports = router;
