import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function ResumeForm() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: '',
    linkedin: '',
    summary: '',
    skills: '',
    jobTitle: '',
    company: '',
    years: '',
    jobDesc: '',
    college: '',
    degree: '',
    gradYear: ''
  });

  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResume('');
    try {
      const res = await fetch('https://resume-builder-7ngc.onrender.com/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      setResume(data.resume);
    } catch (err) {
      alert('Server se connect nahi ho pa raha');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('cv-preview');
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${form.name}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const parsedSummary = resume
    ? resume.split(/PROFESSIONAL SUMMARY/i)[1]?.split(/SKILLS/i)[0]?.trim()
    : form.summary;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="font-semibold text-gray-800">ResumeAI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, {user.name || 'User'} 👋</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4 flex gap-8">
        <div className="w-full max-w-xl flex-shrink-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Build your resume</h1>
          <p className="text-gray-500 text-sm mb-6">Fill details — AI will handle the rest ✨</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-medium text-gray-800 mb-4">👤 Personal info</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-600">Full name</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="rahul@email.com"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">LinkedIn URL</label>
                  <input name="linkedin" value={form.linkedin} onChange={handleChange}
                    placeholder="linkedin.com/in/rahul"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Skills (comma separated)</label>
                  <input name="skills" value={form.skills} onChange={handleChange}
                    placeholder="React, Node.js, Python, MongoDB"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600">Professional summary (optional)</label>
                <textarea name="summary" value={form.summary} onChange={handleChange}
                  placeholder="Write 2-3 lines about yourself..."
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-medium text-gray-800 mb-4">💼 Work experience</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-600">Job title</label>
                  <input name="jobTitle" value={form.jobTitle} onChange={handleChange}
                    placeholder="Software Developer"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Company</label>
                  <input name="company" value={form.company} onChange={handleChange}
                    placeholder="TCS, Infosys, Startup..."
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Duration</label>
                  <input name="years" value={form.years} onChange={handleChange}
                    placeholder="Jan 2023 - Present"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600">What did you do?</label>
                <textarea name="jobDesc" value={form.jobDesc} onChange={handleChange}
                  placeholder="- Built React dashboard\n- Integrated REST APIs"
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-medium text-gray-800 mb-4">🎓 Education</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-600">College / University</label>
                  <input name="college" value={form.college} onChange={handleChange}
                    placeholder="COER University..."
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Degree</label>
                  <input name="degree" value={form.degree} onChange={handleChange}
                    placeholder="B.Tech Computer Science"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Graduation year</label>
                  <input name="gradYear" value={form.gradYear} onChange={handleChange}
                    placeholder="2025"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
              {loading ? '⏳ AI is creating your resume...' : 'Generate Resume with AI ✨'}
            </button>
          </form>
        </div>

        {resume && (
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">📄 CV Preview</h2>
              <button onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Download PDF ⬇
              </button>
            </div>
            <div id="cv-preview" style={{
              background: '#fff', padding: '40px 50px',
              fontFamily: "'Times New Roman', serif", fontSize: '12px',
              color: '#000', maxWidth: '700px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '4px'
            }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>{form.name}</div>
                <div style={{ fontSize: '11px', color: '#333', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {form.email && <span>✉ {form.email}</span>}
                  {form.phone && <span>📞 {form.phone}</span>}
                  {form.linkedin && <span>🔗 {form.linkedin}</span>}
                </div>
              </div>
              {parsedSummary && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '6px' }}>Professional Summary</div>
                  <p style={{ lineHeight: '1.7', color: '#222' }}>{parsedSummary}</p>
                </div>
              )}
              {form.skills && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px' }}>Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {form.skills.split(',').map((s, i) => (
                      <span key={i} style={{ border: '1px solid #000', padding: '2px 10px', fontSize: '11px', borderRadius: '2px' }}>{s.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {form.jobTitle && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px' }}>Work Experience</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{form.jobTitle}</div>
                      <div style={{ fontStyle: 'italic', color: '#444', fontSize: '11px' }}>{form.company}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#444', whiteSpace: 'nowrap' }}>{form.years}</div>
                  </div>
                  <ul style={{ marginTop: '6px', paddingLeft: '16px' }}>
                    {form.jobDesc.split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} style={{ lineHeight: '1.7', color: '#222', listStyle: 'disc', fontSize: '12px' }}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}
              {form.college && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px' }}>Education</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{form.degree}</div>
                      <div style={{ fontStyle: 'italic', color: '#444', fontSize: '11px' }}>{form.college}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#444' }}>{form.gradYear}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}