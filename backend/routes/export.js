const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');
const { resumeDataToText } = require('../utils/groq');

function buildPdfBuffer(resume) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const data = resume.data || {};
    doc.fontSize(22).text(data.name || resume.title, { align: 'center' });
    doc.moveDown(0.3);

    const contact = [data.email, data.phone].filter(Boolean).join(' | ');
    if (contact) {
      doc.fontSize(10).fillColor('#555').text(contact, { align: 'center' });
      doc.fillColor('#000');
    }
    doc.moveDown();

    if (data.summary) {
      doc.fontSize(14).text('Professional Summary', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(11).text(data.summary);
      doc.moveDown();
    }

    if (data.skills?.length) {
      doc.fontSize(14).text('Skills', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(11).text(data.skills.join(', '));
      doc.moveDown();
    }

    if (data.experience?.length) {
      doc.fontSize(14).text('Experience', { underline: true });
      doc.moveDown(0.3);
      data.experience.forEach((exp) => {
        doc.fontSize(12).text(`${exp.position || ''} — ${exp.company || ''}`);
        doc.fontSize(10).fillColor('#555').text(`${exp.startDate || ''} - ${exp.endDate || 'Present'}`);
        doc.fillColor('#000');
        if (exp.desc) doc.fontSize(11).text(exp.desc);
        doc.moveDown(0.5);
      });
    }

    if (data.education?.length) {
      doc.fontSize(14).text('Education', { underline: true });
      doc.moveDown(0.3);
      data.education.forEach((edu) => {
        doc.fontSize(12).text(`${edu.degree || ''} in ${edu.field || ''}`);
        doc.fontSize(11).text(`${edu.school || ''}`);
        doc.moveDown(0.5);
      });
    }

    if (data.projects?.length) {
      doc.fontSize(14).text('Projects', { underline: true });
      doc.moveDown(0.3);
      data.projects.forEach((proj) => {
        doc.fontSize(12).text(proj.name || 'Project');
        if (proj.desc) doc.fontSize(11).text(proj.desc);
        doc.moveDown(0.5);
      });
    }

    doc.end();
  });
}

router.get('/pdf/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const pdfBuffer = await buildPdfBuffer(resume);
    const filename = `${(resume.title || 'resume').replace(/\s+/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/json/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const filename = `${(resume.title || 'resume').replace(/\s+/g, '_')}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json({
      title: resume.title,
      template: resume.template,
      data: resume.data,
      exportedAt: new Date().toISOString(),
      text: resumeDataToText(resume.data),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
