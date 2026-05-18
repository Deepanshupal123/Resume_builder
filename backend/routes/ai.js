const express = require('express');
const router = express.Router();

// Cover Letter Generate
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.choices?.[0]?.message?.content || '';
    res.json({ text });
  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// ATS Score Checker
router.post('/ats', async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Resume and Job Description required' });
  }

  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume against the job description and return ONLY a valid JSON object, no extra text.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return this exact JSON structure:
{
  "score": <number 0-100>,
  "summary": "<one line summary of the match>",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"],
  "sectionScores": {
    "skills": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "keywords": <0-100>
  }
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: 'You are an ATS expert. Always respond with valid JSON only. No markdown, no extra text.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    let text = data.choices?.[0]?.message?.content || '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    res.json(parsed);

  } catch (err) {
    console.error('ATS Error:', err.message);
    res.status(500).json({ error: 'ATS analysis failed' });
  }
});

module.exports = router;
