const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey:process.env.GROQ_API_KEY });

router.post('/generate', async (req, res) => {
  try {
    const {
      name, email, phone, summary, skills,
      jobTitle, company, years, jobDesc,
      college, degree, gradYear
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

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    const resumeText = completion.choices[0].message.content;
    res.json({ success: true, resume: resumeText });

  } catch (err) {
    console.log('Groq Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;