async function callGroq(prompt, maxTokens = 1500) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function resumeDataToText(data = {}) {
  const lines = [];
  if (data.name) lines.push(`Name: ${data.name}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.phone) lines.push(`Phone: ${data.phone}`);
  if (data.summary) lines.push(`\nSummary:\n${data.summary}`);
  if (data.skills?.length) lines.push(`\nSkills: ${data.skills.join(', ')}`);

  if (data.experience?.length) {
    lines.push('\nExperience:');
    data.experience.forEach((exp) => {
      lines.push(`- ${exp.position || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || 'Present'})`);
      if (exp.desc) lines.push(`  ${exp.desc}`);
    });
  }

  if (data.education?.length) {
    lines.push('\nEducation:');
    data.education.forEach((edu) => {
      lines.push(`- ${edu.degree || ''} in ${edu.field || ''}, ${edu.school || ''}`);
    });
  }

  if (data.projects?.length) {
    lines.push('\nProjects:');
    data.projects.forEach((proj) => {
      lines.push(`- ${proj.name || ''}: ${proj.desc || ''}`);
    });
  }

  return lines.join('\n');
}

module.exports = { callGroq, resumeDataToText };
