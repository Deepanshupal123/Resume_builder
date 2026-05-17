import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const templates = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern Blue' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'executive', name: 'Executive' },
];

const emptyExp = { jobTitle: '', company: '', years: '', jobDesc: '' };
const emptyEdu = { degree: '', college: '', gradYear: '' };
const emptyCert = { name: '', issuer: '', year: '' };
const emptyProject = { name: '', desc: '', tech: '' };
const emptyLang = { language: '', level: 'Intermediate' };

export default function Builder() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const savedTemplate = localStorage.getItem('selectedTemplate') || 'classic';
  const [activeTemplate, setActiveTemplate] = useState(savedTemplate);
  const photoRef = useRef();

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: '',
    linkedin: '',
    location: '',
    website: '',
    summary: '',
    skills: '',
    photo: null,
    experiences: [{ ...emptyExp }],
    educations: [{ ...emptyEdu }],
    certifications: [{ ...emptyCert }],
    projects: [{ ...emptyProject }],
    languages: [{ ...emptyLang }],
    hobbies: '',
    accentColor: '#1d4ed8',
    fontFamily: 'Arial, sans-serif',
    fontSize: 12,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, photo: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleArrayChange = (field, index, key, value) => {
    const updated = [...form[field]];
    updated[index][key] = value;
    setForm({ ...form, [field]: updated });
  };

  const addItem = (field, empty) => setForm({ ...form, [field]: [...form[field], { ...empty }] });

  const removeItem = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: updated });
  };

  const handleLogout = () => { localStorage.clear(); window.location.href = '/'; };

  const handleDownloadPDF = () => {
    const element = document.getElementById('cv-preview');
    const opt = {
      margin: [8, 8, 8, 8],
      filename: `${form.name}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const renderPreview = () => {
    switch (activeTemplate) {
      case 'modern': return <ModernTemplate form={form} />;
      case 'creative': return <CreativeTemplate form={form} />;
      case 'minimal': return <MinimalTemplate form={form} />;
      case 'executive': return <ExecutiveTemplate form={form} />;
      default: return <ClassicTemplate form={form} />;
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
            <span className="font-semibold text-gray-800">ResumeAI</span>
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

        {/* LEFT PANEL */}
        <div className="w-96 bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0">
          <div className="p-5 space-y-6">

            {/* Template Selector */}
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

            {/* Color & Font Customization */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🎨 Customize</h2>

              {/* Accent Color */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-2 block">Accent Color</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { color: '#1d4ed8', name: 'Blue' },
                    { color: '#7c3aed', name: 'Purple' },
                    { color: '#059669', name: 'Green' },
                    { color: '#dc2626', name: 'Red' },
                    { color: '#d97706', name: 'Orange' },
                    { color: '#0f172a', name: 'Black' },
                    { color: '#0891b2', name: 'Cyan' },
                    { color: '#be185d', name: 'Pink' },
                  ].map(c => (
                    <button key={c.color}
                      onClick={() => setForm({ ...form, accentColor: c.color })}
                      title={c.name}
                      style={{ background: c.color }}
                      className={`w-7 h-7 rounded-full border-2 transition ${form.accentColor === c.color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block">Font Style</label>
                <select value={form.fontFamily} onChange={e => setForm({ ...form, fontFamily: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="'Times New Roman', serif">Classic Serif</option>
                  <option value="Arial, sans-serif">Modern Sans</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Helvetica Neue', sans-serif">Helvetica</option>
                  <option value="'Courier New', monospace">Courier (Tech)</option>
                  <option value="Garamond, serif">Garamond</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Font Size: {form.fontSize}px</label>
                <input type="range" min="10" max="14" step="0.5"
                  value={form.fontSize}
                  onChange={e => setForm({ ...form, fontSize: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <Section title="📸 Profile Photo">
              <div className="flex items-center gap-4">
                {form.photo
                  ? <img src={form.photo} alt="profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
                  : <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl border-2 border-dashed border-gray-300">👤</div>
                }
                <div>
                  <button onClick={() => photoRef.current.click()}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium">
                    Upload Photo
                  </button>
                  {form.photo && <button onClick={() => setForm({ ...form, photo: null })} className="ml-2 text-xs text-red-400 hover:text-red-600">Remove</button>}
                  <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 2MB</p>
                </div>
              </div>
            </Section>

            {/* Personal Info */}
            <Section title="👤 Personal Info">
              <div className="space-y-2">
                {[
                  { name: 'name', label: 'Full Name', placeholder: 'John Smith' },
                  { name: 'email', label: 'Email', placeholder: 'john@email.com' },
                  { name: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
                  { name: 'location', label: 'Location', placeholder: 'Delhi, India' },
                  { name: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/john' },
                  { name: 'website', label: 'Website/Portfolio', placeholder: 'johndoe.com' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-xs text-gray-500">{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-500">Professional Summary</label>
                  <textarea name="summary" value={form.summary} onChange={handleChange}
                    placeholder="Experienced developer with 3+ years..." rows={3}
                    className="mt-0.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </Section>

            {/* Skills */}
            <Section title="🛠 Skills">
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="React, Node.js, Python, MongoDB, AWS"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">Comma se alag karo</p>
            </Section>

            {/* Work Experience */}
            <Section title="💼 Work Experience">
              {form.experiences.map((exp, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Experience {i + 1}</span>
                    {form.experiences.length > 1 &&
                      <button onClick={() => removeItem('experiences', i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
                  </div>
                  {[
                    { key: 'jobTitle', placeholder: 'Software Developer', label: 'Job Title' },
                    { key: 'company', placeholder: 'Company Name', label: 'Company' },
                    { key: 'years', placeholder: 'Jan 2023 - Present', label: 'Duration' },
                  ].map(f => (
                    <div key={f.key} className="mb-2">
                      <label className="text-xs text-gray-500">{f.label}</label>
                      <input value={exp[f.key]} onChange={e => handleArrayChange('experiences', i, f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="mt-0.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-gray-500">Description</label>
                    <textarea value={exp.jobDesc} onChange={e => handleArrayChange('experiences', i, 'jobDesc', e.target.value)}
                      placeholder="- Built React dashboard&#10;- Integrated REST APIs" rows={3}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              ))}
              <button onClick={() => addItem('experiences', emptyExp)}
                className="w-full text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg py-2 hover:bg-blue-50">
                + Add Experience
              </button>
            </Section>

            {/* Education */}
            <Section title="🎓 Education">
              {form.educations.map((edu, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Education {i + 1}</span>
                    {form.educations.length > 1 &&
                      <button onClick={() => removeItem('educations', i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
                  </div>
                  {[
                    { key: 'degree', placeholder: 'B.Tech Computer Science', label: 'Degree' },
                    { key: 'college', placeholder: 'COER University', label: 'College/University' },
                    { key: 'gradYear', placeholder: '2025', label: 'Year' },
                  ].map(f => (
                    <div key={f.key} className="mb-2">
                      <label className="text-xs text-gray-500">{f.label}</label>
                      <input value={edu[f.key]} onChange={e => handleArrayChange('educations', i, f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="mt-0.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={() => addItem('educations', emptyEdu)}
                className="w-full text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg py-2 hover:bg-blue-50">
                + Add Education
              </button>
            </Section>

            {/* Projects */}
            <Section title="🚀 Projects">
              {form.projects.map((proj, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Project {i + 1}</span>
                    {form.projects.length > 1 &&
                      <button onClick={() => removeItem('projects', i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
                  </div>
                  {[
                    { key: 'name', placeholder: 'ResumeAI', label: 'Project Name' },
                    { key: 'tech', placeholder: 'React, Node.js, MongoDB', label: 'Technologies' },
                  ].map(f => (
                    <div key={f.key} className="mb-2">
                      <label className="text-xs text-gray-500">{f.label}</label>
                      <input value={proj[f.key]} onChange={e => handleArrayChange('projects', i, f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="mt-0.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-gray-500">Description</label>
                    <textarea value={proj.desc} onChange={e => handleArrayChange('projects', i, 'desc', e.target.value)}
                      placeholder="AI-powered resume builder..." rows={2}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              ))}
              <button onClick={() => addItem('projects', emptyProject)}
                className="w-full text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg py-2 hover:bg-blue-50">
                + Add Project
              </button>
            </Section>

            {/* Certifications */}
            <Section title="🏆 Certifications">
              {form.certifications.map((cert, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Certification {i + 1}</span>
                    {form.certifications.length > 1 &&
                      <button onClick={() => removeItem('certifications', i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
                  </div>
                  {[
                    { key: 'name', placeholder: 'AWS Solutions Architect', label: 'Certificate Name' },
                    { key: 'issuer', placeholder: 'Amazon Web Services', label: 'Issuer' },
                    { key: 'year', placeholder: '2024', label: 'Year' },
                  ].map(f => (
                    <div key={f.key} className="mb-2">
                      <label className="text-xs text-gray-500">{f.label}</label>
                      <input value={cert[f.key]} onChange={e => handleArrayChange('certifications', i, f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="mt-0.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={() => addItem('certifications', emptyCert)}
                className="w-full text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg py-2 hover:bg-blue-50">
                + Add Certification
              </button>
            </Section>

            {/* Languages */}
            <Section title="🌐 Languages">
              {form.languages.map((lang, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input value={lang.language} onChange={e => handleArrayChange('languages', i, 'language', e.target.value)}
                    placeholder="English"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <select value={lang.level} onChange={e => handleArrayChange('languages', i, 'level', e.target.value)}
                    className="rounded-lg border border-gray-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map(l => <option key={l}>{l}</option>)}
                  </select>
                  {form.languages.length > 1 &&
                    <button onClick={() => removeItem('languages', i)} className="text-red-400 hover:text-red-600 text-lg">×</button>}
                </div>
              ))}
              <button onClick={() => addItem('languages', emptyLang)}
                className="w-full text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg py-2 hover:bg-blue-50">
                + Add Language
              </button>
            </Section>

            {/* Hobbies */}
            <Section title="🎯 Hobbies & Interests">
              <input name="hobbies" value={form.hobbies} onChange={handleChange}
                placeholder="Reading, Coding, Cricket, Photography"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </Section>

          </div>
        </div>

        {/* RIGHT — Live Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center">
          <div id="cv-preview" className="w-full max-w-2xl">
            {renderPreview()}
          </div>
        </div>

      </div>
    </div>
  );
}

// ===== SHARED HELPERS =====
function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

// ===== TEMPLATE 1: CLASSIC =====
function ClassicTemplate({ form }) {
  const accent = form.accentColor || '#000';
  const font = form.fontFamily || "'Times New Roman', serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', padding: '36px 44px', fontFamily: font, fontSize: `${size}px`, color: '#000', minHeight: '842px' }}>
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}` }} />}
        <div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', color: accent }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '10px', color: '#444', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {form.email && <span>✉ {form.email}</span>}
            {form.phone && <span>📞 {form.phone}</span>}
            {form.location && <span>📍 {form.location}</span>}
            {form.linkedin && <span>🔗 {form.linkedin}</span>}
          </div>
        </div>
      </div>
      {form.summary && <CVSection title="Professional Summary" accent={accent}><p style={{ lineHeight: '1.7' }}>{form.summary}</p></CVSection>}
      {form.skills && <CVSection title="Skills" accent={accent}><div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ border: `1px solid ${accent}`, color: accent, padding: '1px 8px', fontSize: '10px' }}>{s.trim()}</span>)}</div></CVSection>}
      {form.experiences.some(e => e.jobTitle) && <CVSection title="Work Experience" accent={accent}>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</CVSection>}
      {form.projects.some(p => p.name) && <CVSection title="Projects" accent={accent}>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: accent }}>{proj.name} {proj.tech && <span style={{ fontWeight: 'normal', fontSize: '10px', color: '#555' }}>— {proj.tech}</span>}</div><div style={{ fontSize: '10px', color: '#333', lineHeight: '1.6' }}>{proj.desc}</div></div>)}</CVSection>}
      {form.educations.some(e => e.degree) && <CVSection title="Education" accent={accent}>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</CVSection>}
      {form.certifications.some(c => c.name) && <CVSection title="Certifications" accent={accent}>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '11px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</CVSection>}
      {form.languages.some(l => l.language) && <CVSection title="Languages" accent={accent}><div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>{form.languages.filter(l => l.language).map((l, i) => <span key={i} style={{ fontSize: '10px' }}><strong>{l.language}</strong> — {l.level}</span>)}</div></CVSection>}
      {form.hobbies && <CVSection title="Interests" accent={accent}><p style={{ fontSize: '11px' }}>{form.hobbies}</p></CVSection>}
    </div>
  );
}

// ===== TEMPLATE 2: MODERN BLUE =====
function ModernTemplate({ form }) {
  const accent = form.accentColor || '#1d4ed8';
  const font = form.fontFamily || 'Arial, sans-serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px', display: 'flex' }}>
      <div style={{ width: '210px', background: accent, color: '#fff', padding: '28px 16px', flexShrink: 0 }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />}
        <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '2px' }}>{form.name || 'Your Name'}</div>
        <div style={{ fontSize: '9px', opacity: 0.8, textAlign: 'center', marginBottom: '16px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
        <div style={{ fontSize: '9px', marginBottom: '16px', lineHeight: '1.8' }}>
          {form.email && <div>✉ {form.email}</div>}
          {form.phone && <div>📞 {form.phone}</div>}
          {form.location && <div>📍 {form.location}</div>}
          {form.linkedin && <div>🔗 {form.linkedin}</div>}
        </div>
        {form.skills && <><SideTitle>Skills</SideTitle>{form.skills.split(',').map((s, i) => <div key={i} style={{ fontSize: '9px', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '2px', marginBottom: '3px' }}>{s.trim()}</div>)}</>}
        {form.languages.some(l => l.language) && <><SideTitle>Languages</SideTitle>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '9px', marginBottom: '3px' }}>{l.language} <span style={{ opacity: 0.7 }}>— {l.level}</span></div>)}</>}
        {form.hobbies && <><SideTitle>Interests</SideTitle><div style={{ fontSize: '9px', opacity: 0.9, lineHeight: '1.6' }}>{form.hobbies}</div></>}
      </div>
      <div style={{ flex: 1, padding: '28px 20px' }}>
        {form.summary && <><BlueTitle color={accent}>Summary</BlueTitle><p style={{ lineHeight: '1.7', marginBottom: '14px', fontSize: '11px', color: '#444' }}>{form.summary}</p></>}
        {form.experiences.some(e => e.jobTitle) && <><BlueTitle color={accent}>Experience</BlueTitle>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
        {form.projects.some(p => p.name) && <><BlueTitle color={accent}>Projects</BlueTitle>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: accent }}>{proj.name}</div>{proj.tech && <div style={{ fontSize: '9px', color: '#666' }}>{proj.tech}</div>}<div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{proj.desc}</div></div>)}</>}
        {form.educations.some(e => e.degree) && <><BlueTitle color={accent}>Education</BlueTitle>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        {form.certifications.some(c => c.name) && <><BlueTitle color={accent}>Certifications</BlueTitle>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</>}
      </div>
    </div>
  );
}

// ===== TEMPLATE 3: CREATIVE =====
function CreativeTemplate({ form }) {
  const accent = form.accentColor || '#7c3aed';
  const font = form.fontFamily || 'Georgia, serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ background: `linear-gradient(135deg, ${accent}, #db2777)`, color: '#fff', padding: '28px 36px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)', flexShrink: 0 }} />}
        <div>
          <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '9px', flexWrap: 'wrap', opacity: 0.9 }}>
            {form.email && <span>✉ {form.email}</span>}
            {form.phone && <span>📞 {form.phone}</span>}
            {form.location && <span>📍 {form.location}</span>}
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 36px' }}>
        {form.summary && <><PurpleTitle color={accent}>About Me</PurpleTitle><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '16px' }}>{form.summary}</p></>}
        {form.skills && <><PurpleTitle color={accent}>Skills</PurpleTitle><div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ background: `${accent}22`, color: accent, padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' }}>{s.trim()}</span>)}</div></>}
        {form.experiences.some(e => e.jobTitle) && <><PurpleTitle color={accent}>Experience</PurpleTitle>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
        {form.projects.some(p => p.name) && <><PurpleTitle color={accent}>Projects</PurpleTitle>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: accent }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{proj.desc}</div></div>)}</>}
        {form.educations.some(e => e.degree) && <><PurpleTitle color={accent}>Education</PurpleTitle>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        {form.certifications.some(c => c.name) && <><PurpleTitle color={accent}>Certifications</PurpleTitle>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</>}
        {form.languages.some(l => l.language) && <><PurpleTitle color={accent}>Languages</PurpleTitle><div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>{form.languages.filter(l => l.language).map((l, i) => <span key={i} style={{ fontSize: '10px', background: `${accent}22`, color: accent, padding: '2px 10px', borderRadius: '20px' }}>{l.language} — {l.level}</span>)}</div></>}
      </div>
    </div>
  );
}

// ===== TEMPLATE 4: MINIMAL =====
function MinimalTemplate({ form }) {
  const accent = form.accentColor || '#059669';
  const font = form.fontFamily || "'Helvetica Neue', sans-serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, padding: '44px', minHeight: '842px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />}
        <div>
          <div style={{ fontSize: '28px', fontWeight: '300', letterSpacing: '4px', textTransform: 'uppercase', color: '#111' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '11px', color: accent, letterSpacing: '1px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '4px', fontSize: '10px', color: '#666' }}>
            {form.email && <span>{form.email}</span>}
            {form.phone && <span>{form.phone}</span>}
            {form.location && <span>{form.location}</span>}
          </div>
        </div>
      </div>
      <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '18px' }} />
      {form.summary && <><GreenTitle color={accent}>Profile</GreenTitle><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '16px' }}>{form.summary}</p></>}
      {form.skills && <><GreenTitle color={accent}>Skills</GreenTitle><p style={{ color: '#444', marginBottom: '16px', lineHeight: '1.8' }}>{form.skills}</p></>}
      {form.experiences.some(e => e.jobTitle) && <><GreenTitle color={accent}>Experience</GreenTitle>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
      {form.projects.some(p => p.name) && <><GreenTitle color={accent}>Projects</GreenTitle>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: accent }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{proj.desc}</div></div>)}</>}
      {form.educations.some(e => e.degree) && <><GreenTitle color={accent}>Education</GreenTitle>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
      {form.certifications.some(c => c.name) && <><GreenTitle color={accent}>Certifications</GreenTitle>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</>}
      {form.languages.some(l => l.language) && <><GreenTitle color={accent}>Languages</GreenTitle><div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>{form.languages.filter(l => l.language).map((l, i) => <span key={i} style={{ fontSize: '10px', color: '#444' }}>{l.language} — {l.level}</span>)}</div></>}
    </div>
  );
}

// ===== TEMPLATE 5: EXECUTIVE =====
function ExecutiveTemplate({ form }) {
  const accent = form.accentColor || '#f59e0b';
  const font = form.fontFamily || 'Georgia, serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ background: '#1e293b', color: '#fff', padding: '30px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flexShrink: 0 }} />}
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '11px', color: accent, marginTop: '2px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '9px', color: '#94a3b8', flexWrap: 'wrap' }}>
            {form.email && <span>✉ {form.email}</span>}
            {form.phone && <span>📞 {form.phone}</span>}
            {form.location && <span>📍 {form.location}</span>}
            {form.linkedin && <span>🔗 {form.linkedin}</span>}
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 40px' }}>
        {form.summary && <><ExecTitle color={accent}>Executive Summary</ExecTitle><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '18px' }}>{form.summary}</p></>}
        {form.skills && <><ExecTitle color={accent}>Core Competencies</ExecTitle><div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ background: '#1e293b', color: accent, padding: '2px 10px', fontSize: '10px' }}>{s.trim()}</span>)}</div></>}
        {form.experiences.some(e => e.jobTitle) && <><ExecTitle color={accent}>Professional Experience</ExecTitle>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
        {form.projects.some(p => p.name) && <><ExecTitle color={accent}>Key Projects</ExecTitle>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: '#1e293b' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{proj.desc}</div></div>)}</>}
        {form.educations.some(e => e.degree) && <><ExecTitle color={accent}>Education</ExecTitle>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        {form.certifications.some(c => c.name) && <><ExecTitle color={accent}>Certifications</ExecTitle>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</>}
        {form.languages.some(l => l.language) && <><ExecTitle color={accent}>Languages</ExecTitle><div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>{form.languages.filter(l => l.language).map((l, i) => <span key={i} style={{ fontSize: '10px' }}><strong>{l.language}</strong> — {l.level}</span>)}</div></>}
      </div>
    </div>
  );
}

// ===== SHARED SMALL COMPONENTS =====
function CVSection({ title, accent, children }) {
  return <div style={{ marginBottom: '14px' }}><div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `1px solid ${accent || '#000'}`, paddingBottom: '3px', marginBottom: '7px', color: accent || '#000' }}>{title}</div>{children}</div>;
}
function ExpItem({ exp, accentColor }) {
  return <div style={{ marginBottom: '10px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontWeight: 'bold', color: accentColor || '#000' }}>{exp.jobTitle}</div><div style={{ fontStyle: 'italic', color: '#666', fontSize: '10px' }}>{exp.company}</div></div><div style={{ fontSize: '10px', color: '#666' }}>{exp.years}</div></div><ul style={{ marginTop: '5px', paddingLeft: '14px' }}>{exp.jobDesc.split('\n').filter(l => l.trim()).map((line, i) => <li key={i} style={{ lineHeight: '1.7', color: '#333', listStyle: 'disc', fontSize: '10px' }}>{line.replace(/^[-•]\s*/, '')}</li>)}</ul></div>;
}
function EduItem({ edu }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><div><div style={{ fontWeight: 'bold', fontSize: '11px' }}>{edu.degree}</div><div style={{ fontStyle: 'italic', color: '#666', fontSize: '10px' }}>{edu.college}</div></div><div style={{ fontSize: '10px', color: '#666' }}>{edu.gradYear}</div></div>;
}
function SideTitle({ children }) {
  return <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '3px', marginBottom: '6px', marginTop: '14px' }}>{children}</div>;
}
function BlueTitle({ children, color }) {
  return <div style={{ fontSize: '11px', fontWeight: 'bold', color: color || '#1d4ed8', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${color || '#1d4ed8'}`, paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>{children}</div>;
}
function PurpleTitle({ children, color }) {
  return <div style={{ fontSize: '11px', fontWeight: 'bold', color: color || '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '14px' }}>{children}</div>;
}
function GreenTitle({ children, color }) {
  return <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: color || '#059669', marginBottom: '6px', marginTop: '14px' }}>{children}</div>;
}
function ExecTitle({ children, color }) {
  return <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `2px solid ${color || '#f59e0b'}`, paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>{children}</div>;
}