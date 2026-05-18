const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
 
// ── Multer config ─────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF or TXT files allowed'));
  }
});
 
// ── PDF text extract ──────────────────────────────────────────────────────────
async function extractTextFromBuffer(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err) {
      console.error('PDF parse error:', err.message);
      // Fallback: basic text extraction
      return buffer.toString('latin1')
        .replace(/[^\x20-\x7E\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }
  return buffer.toString('utf-8');
}
 
// ── Groq API helper ───────────────────────────────────────────────────────────
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
 
// ── Route 1: Cover Letter Generate ───────────────────────────────────────────
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
 
// ── Route 2: ATS Score Checker (PDF Upload) ───────────────────────────────────
router.post('/ats-check', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
 
    if (!req.file) return res.status(400).json({ error: 'Resume file required' });
    if (!jobDescription) return res.status(400).json({ error: 'Job description required' });
 
    // PDF se text extract karo
    const resumeText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
 
    console.log('Extracted resume text length:', resumeText.length);
    console.log('Resume preview:', resumeText.substring(0, 200));
 
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Resume text extract nahi hua. Text-based PDF use karo (scanned PDF kaam nahi karega).' });
    }
 
    const prompt = `You are an ATS (Applicant Tracking System) expert. Carefully analyze this resume against the job description and provide an accurate ATS score.
 
RESUME TEXT:
${resumeText.substring(0, 3000)}
 
JOB DESCRIPTION:
${jobDescription.substring(0, 1500)}
 
Analyze carefully and respond ONLY in this exact JSON format (no extra text before or after):
{
  "score": <number 0-100>,
  "grade": "<A/B/C/D/F>",
  "summary": "<2 sentence overall assessment>",
  "matchedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
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
    console.log('AI raw response:', rawText.substring(0, 300));
 
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
 
// ── Route 3: JD Match (PDF Upload) ───────────────────────────────────────────
router.post('/jd-match', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
 
    if (!req.file) return res.status(400).json({ error: 'Resume file required' });
    if (!jobDescription) return res.status(400).json({ error: 'Job description required' });
 
    // PDF se text extract karo
    const resumeText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
 
    console.log('JD Match - Resume text length:', resumeText.length);
 
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Resume text extract nahi hua. Text-based PDF use karo.' });
    }
 
    const prompt = `Carefully analyze this resume against the job description for keyword and skill matching.
 
RESUME TEXT:
${resumeText.substring(0, 2000)}
 
JOB DESCRIPTION:
${jobDescription.substring(0, 1000)}
 
Respond ONLY in this exact JSON format (no extra text):
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "missingSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4"]
}`;
 
    const rawText = await callGroq(prompt, 800);
 
    let result;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      return res.status(500).json({ error: 'AI response parse nahi hua. Try again.' });
    }
 
    res.json(result);
  } catch (err) {
    console.error('JD match error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;