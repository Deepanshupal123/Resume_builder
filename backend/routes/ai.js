const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');

// Multer — memory mein store karo (disk nahi)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'text/plain'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, TXT files allowed'));
    }
  }
});

// Helper: Groq API call
async function callGroq(prompt, maxTokens = 1500) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// ─── Route 1: Cover Letter Generate ───────────────────────────────────────────
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    const text = await callGroq(prompt, 1000);
    res.json({ text });
  } catch (err) {
    console.error('Cover letter error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Route 2: ATS Score Checker (PDF Upload) ──────────────────────────────────
router.post('/ats-check', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Resume file required' });
    if (!jobDescription) return res.status(400).json({ error: 'Job description required' });

    // PDF text extract karo
    let resumeText = '';
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } else {
      // TXT file ke liye
      resumeText = req.file.buffer.toString('utf-8');
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Resume text extract nahi hua. Text-based PDF use karo.' });
    }

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume against the job description and provide a detailed ATS score report.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 1500)}

Respond ONLY in this exact JSON format (no extra text):
{
  "score": <number 0-100>,
  "grade": "<A/B/C/D/F>",
  "summary": "<2 sentence overall assessment>",
  "matchedKeywords": ["keyword1", "keyword2", "keyword3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "sections": {
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "format": <number 0-100>
  }
}`;

    const rawText = await callGroq(prompt, 1200);

    // JSON parse karo
    let result;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      return res.status(500).json({ error: 'AI response parse nahi hua. Try again.' });
    }

    res.json(result);
  } catch (err) {
    console.error('ATS check error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Route 3: Job Description Match ───────────────────────────────────────────
router.post('/jd-match', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Resume text and job description required' });
    }

    const prompt = `Analyze resume vs job description for keyword matching.

RESUME: ${resumeText.substring(0, 2000)}
JOB DESCRIPTION: ${jobDescription.substring(0, 1000)}

Respond ONLY in JSON:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    const rawText = await callGroq(prompt, 800);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
