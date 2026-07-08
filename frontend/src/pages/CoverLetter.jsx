import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { API_BASE } from '../utils/api';

const templates = [
  { id: 'professional', name: 'Professional' },
  { id: 'modern', name: 'Modern' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'executive', name: 'Executive' },
];

export default function CoverLetter() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTemplate, setActiveTemplate] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: '',
    location: '',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    hiringManager: '',
    company: '',
    jobTitle: '',
    jobDescription: '',
    mySkills: '',
    experience: '',
    whyCompany: '',
    body: '',
    accentColor: '#1d4ed8',
    fontFamily: 'Arial, sans-serif',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogout = () => { localStorage.clear(); window.location.href = '/'; };

  const handleDownloadPDF = () => {
    const element = document.getElementById('cl-preview');
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${form.name}_CoverLetter.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

 const handleAIGenerate = async () => {
  if (!form.jobTitle || !form.company) {
    alert('Please fill Job Title and Company Name first!');
    return;
  }
  setAiGenerating(true);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        prompt: `Write a professional cover letter body (3 paragraphs only, no greeting/sign-off) for:
Name: ${form.name || 'the applicant'}
Job Title: ${form.jobTitle}
Company: ${form.company}
Skills: ${form.mySkills || 'not specified'}
Experience: ${form.experience || 'not specified'}
Why this company: ${form.whyCompany || 'not specified'}
Job Description: ${form.jobDescription || 'not specified'}

Write 3 compelling paragraphs. Be specific, professional, and concise.`
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    setForm(prev => ({ ...prev, body: data.text }));
  } catch (err) {
    alert('AI generation failed: ' + err.message);
  }
  setAiGenerating(false);
};
  const renderPreview = () => {
    const accent = form.accentColor;
    const font = form.fontFamily;

    const greeting = `Dear ${form.hiringManager ? form.hiringManager : 'Hiring Manager'},`;
    const opening = `I am writing to express my strong interest in the ${form.jobTitle || '[Job Title]'} position at ${form.company || '[Company Name]'}.`;
    const closing = `I would welcome the opportunity to discuss how my background aligns with ${form.company || 'your company'}'s needs. Thank you for your time and consideration.`;
    const signoff = `Sincerely,\n${form.name || 'Your Name'}`;

    const bodyContent = form.body || `[Your cover letter body will appear here. Fill in the details on the left and click "✨ AI Generate" or write manually in the Body field.]`;

    switch (activeTemplate) {
      case 'modern':
        return (
          <div style={{ background: '#fff', fontFamily: font, minHeight: '842px' }}>
            <div style={{ background: accent, padding: '32px 40px', color: '#fff' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>{form.name || 'Your Name'}</div>
              <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '6px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {form.email && <span>✉ {form.email}</span>}
                {form.phone && <span>📞 {form.phone}</span>}
                {form.location && <span>📍 {form.location}</span>}
              </div>
            </div>
            <div style={{ padding: '32px 40px', fontSize: '12px', lineHeight: '1.8', color: '#333' }}>
              <div style={{ color: '#888', marginBottom: '20px', fontSize: '11px' }}>{form.date}</div>
              {form.hiringManager && <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>{form.hiringManager}</div>}
              {form.company && <div style={{ marginBottom: '20px', color: '#555' }}>{form.company}</div>}
              <div style={{ marginBottom: '16px' }}>{greeting}</div>
              <div style={{ marginBottom: '14px' }}>{opening}</div>
              {bodyContent.split('\n\n').map((para, i) => (
                <div key={i} style={{ marginBottom: '14px' }}>{para}</div>
              ))}
              <div style={{ marginBottom: '14px' }}>{closing}</div>
              <div style={{ marginTop: '28px', whiteSpace: 'pre-line' }}>{signoff}</div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div style={{ background: '#fff', fontFamily: font, minHeight: '842px' }}>
            <div style={{ background: `linear-gradient(135deg, ${accent}, #db2777)`, padding: '36px 40px', color: '#fff' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{form.name || 'Your Name'}</div>
              <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>Cover Letter — {form.jobTitle || 'Position'}</div>
              <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '8px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                {form.email && <span>{form.email}</span>}
                {form.phone && <span>{form.phone}</span>}
                {form.location && <span>{form.location}</span>}
              </div>
            </div>
            <div style={{ padding: '32px 40px', fontSize: '12px', lineHeight: '1.8', color: '#333' }}>
              <div style={{ color: '#888', marginBottom: '20px' }}>{form.date}</div>
              {form.company && <div style={{ marginBottom: '20px', fontWeight: 'bold', color: accent }}>{form.company}</div>}
              <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>{greeting}</div>
              <div style={{ marginBottom: '14px', borderLeft: `3px solid ${accent}`, paddingLeft: '14px' }}>{opening}</div>
              {bodyContent.split('\n\n').map((para, i) => (
                <div key={i} style={{ marginBottom: '14px' }}>{para}</div>
              ))}
              <div style={{ marginBottom: '14px' }}>{closing}</div>
              <div style={{ marginTop: '28px', whiteSpace: 'pre-line', color: accent, fontWeight: 'bold' }}>{signoff}</div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div style={{ background: '#fff', fontFamily: font, minHeight: '842px', padding: '52px' }}>
            <div style={{ marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
              <div style={{ fontSize: '26px', fontWeight: '300', letterSpacing: '3px', textTransform: 'uppercase', color: '#111' }}>{form.name || 'Your Name'}</div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '10px', color: '#888' }}>
                {form.email && <span>{form.email}</span>}
                {form.phone && <span>{form.phone}</span>}
                {form.location && <span>{form.location}</span>}
              </div>
            </div>
            <div style={{ fontSize: '12px', lineHeight: '1.9', color: '#333' }}>
              <div style={{ color: '#aaa', marginBottom: '24px', fontSize: '11px' }}>{form.date}</div>
              {form.hiringManager && <div style={{ marginBottom: '4px' }}>{form.hiringManager}</div>}
              {form.company && <div style={{ marginBottom: '24px', color: '#666' }}>{form.company}</div>}
              <div style={{ marginBottom: '18px' }}>{greeting}</div>
              <div style={{ marginBottom: '16px' }}>{opening}</div>
              {bodyContent.split('\n\n').map((para, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>{para}</div>
              ))}
              <div style={{ marginBottom: '16px' }}>{closing}</div>
              <div style={{ marginTop: '36px', whiteSpace: 'pre-line', color: '#555' }}>{signoff}</div>
            </div>
          </div>
        );

      case 'executive':
        return (
          <div style={{ background: '#fff', fontFamily: font, minHeight: '842px' }}>
            <div style={{ background: '#1e293b', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', letterSpacing: '2px', textTransform: 'uppercase' }}>{form.name || 'Your Name'}</div>
                <div style={{ fontSize: '11px', color: form.accentColor, marginTop: '4px', letterSpacing: '1px' }}>{form.jobTitle || 'Professional'}</div>
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'right', lineHeight: '2' }}>
                {form.email && <div>{form.email}</div>}
                {form.phone && <div>{form.phone}</div>}
                {form.location && <div>{form.location}</div>}
              </div>
            </div>
            <div style={{ padding: '32px 40px', fontSize: '12px', lineHeight: '1.8', color: '#333' }}>
              <div style={{ color: '#888', marginBottom: '20px' }}>{form.date}</div>
              {form.hiringManager && <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{form.hiringManager}</div>}
              {form.company && <div style={{ marginBottom: '20px', color: '#555' }}>{form.company}</div>}
              <div style={{ height: '2px', background: form.accentColor, marginBottom: '20px' }} />
              <div style={{ marginBottom: '16px' }}>{greeting}</div>
              <div style={{ marginBottom: '14px' }}>{opening}</div>
              {bodyContent.split('\n\n').map((para, i) => (
                <div key={i} style={{ marginBottom: '14px' }}>{para}</div>
              ))}
              <div style={{ marginBottom: '14px' }}>{closing}</div>
              <div style={{ marginTop: '28px', whiteSpace: 'pre-line' }}>{signoff}</div>
            </div>
          </div>
        );

      default: // professional
        return (
          <div style={{ background: '#fff', fontFamily: font, minHeight: '842px', padding: '48px' }}>
            <div style={{ textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: accent }}>{form.name || 'Your Name'}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '10px', color: '#555', flexWrap: 'wrap' }}>
                {form.email && <span>✉ {form.email}</span>}
                {form.phone && <span>📞 {form.phone}</span>}
                {form.location && <span>📍 {form.location}</span>}
              </div>
            </div>
            <div style={{ fontSize: '12px', lineHeight: '1.8', color: '#333' }}>
              <div style={{ marginBottom: '20px', color: '#666' }}>{form.date}</div>
              {form.hiringManager && <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{form.hiringManager}</div>}
              {form.company && <div style={{ marginBottom: '20px', fontStyle: 'italic', color: '#555' }}>{form.company}</div>}
              <div style={{ marginBottom: '16px' }}>{greeting}</div>
              <div style={{ marginBottom: '14px' }}>{opening}</div>
              {bodyContent.split('\n\n').map((para, i) => (
                <div key={i} style={{ marginBottom: '14px' }}>{para}</div>
              ))}
              <div style={{ marginBottom: '14px' }}>{closing}</div>
              <div style={{ marginTop: '32px', whiteSpace: 'pre-line' }}>{signoff}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="font-semibold text-gray-800">ResumeAI — Cover Letter</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDownloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Download PDF ⬇
          </button>
          <span className="text-sm text-gray-500">Hi, {user.name || 'User'} 👋</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 52px)' }}>
        {/* Left Panel */}
        <div className="w-96 bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0">
          <div className="p-5 space-y-6">

            {/* Templates */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Template</h2>
              <div className="flex flex-wrap gap-2">
                {templates.map(t => (
                  <button key={t.id} onClick={() => setActiveTemplate(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${activeTemplate === t.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Customize */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🎨 Customize</h2>
              <label className="text-xs text-gray-500 mb-2 block">Accent Color</label>
              <div className="flex gap-2 flex-wrap mb-3">
                {['#1d4ed8','#7c3aed','#059669','#dc2626','#d97706','#0f172a','#0891b2','#be185d'].map(c => (
                  <button key={c} onClick={() => setForm({ ...form, accentColor: c })}
                    style={{ background: c }}
                    className={`w-7 h-7 rounded-full border-2 transition ${form.accentColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`} />
                ))}
              </div>
              <label className="text-xs text-gray-500 mb-1 block">Font Style</label>
              <select value={form.fontFamily} onChange={e => setForm({ ...form, fontFamily: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: '#ffffff', color: '#111827', WebkitTextFillColor: '#111827' }}>
                <option value="Arial, sans-serif">Modern Sans</option>
                <option value="'Times New Roman', serif">Classic Serif</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Helvetica Neue', sans-serif">Helvetica</option>
                <option value="Garamond, serif">Garamond</option>
              </select>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">👤 Your Info</h3>
              <div className="space-y-2">
                {[
                  { name: 'name', label: 'Full Name', placeholder: 'Deepanshu Pal' },
                  { name: 'email', label: 'Email', placeholder: 'you@email.com' },
                  { name: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
                  { name: 'location', label: 'Location', placeholder: 'Delhi, India' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-xs text-gray-500">{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: '#ffffff', color: '#111827', WebkitTextFillColor: '#111827' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Job Info */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">💼 Job Details</h3>
              <div className="space-y-2">
                {[
                  { name: 'jobTitle', label: 'Job Title', placeholder: 'Software Developer' },
                  { name: 'company', label: 'Company Name', placeholder: 'Google India' },
                  { name: 'hiringManager', label: 'Hiring Manager (optional)', placeholder: 'Mr. Rahul Sharma' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-xs text-gray-500">{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: '#ffffff', color: '#111827', WebkitTextFillColor: '#111827' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Section */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">✨ AI Generate</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Your Skills</label>
                  <input name="mySkills" value={form.mySkills} onChange={handleChange}
                    placeholder="React, Node.js, Python..."
                    className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#ffffff', color: '#111827', WebkitTextFillColor: '#111827' }} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Your Experience</label>
                  <input name="experience" value={form.experience} onChange={handleChange}
                    placeholder="2 years in web development..."
                    className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#ffffff', color: '#111827', WebkitTextFillColor: '#111827' }} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Why This Company?</label>
                  <input name="whyCompany" value={form.whyCompany} onChange={handleChange}
                    placeholder="Love their product innovation..."
                    className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#ffffff', color: '#111827', WebkitTextFillColor: '#111827' }} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Job Description (paste keywords)</label>
                  <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange}
                    placeholder="Paste JD here for better AI match..." rows={3}
                    className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: '#ffffff', color: '#111827', WebkitTextFillColor: '#111827' }} />
                </div>
              </div>
              <button onClick={handleAIGenerate} disabled={aiGenerating}
                className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition">
                {aiGenerating ? '⏳ Generating...' : '✨ AI Generate Cover Letter'}
              </button>
            </div>

            {/* Manual Body */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">✏️ Edit Body Manually</h3>
              <textarea name="body" value={form.body} onChange={handleChange}
                placeholder="Generate with AI or write manually here..."
                rows={10}
                className="w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: '#ffffff', color: '#111827', WebkitTextFillColor: '#111827' }} />
              {form.body && (
                <button onClick={() => setForm({ ...form, body: '' })}
                  className="mt-1 text-xs text-red-400 hover:text-red-600">Clear</button>
              )}
            </div>

          </div>
        </div>

        {/* Right Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center">
          <div id="cl-preview" className="w-full max-w-2xl shadow-lg">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
