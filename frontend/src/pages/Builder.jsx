import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import UpgradeModal from '../pages/UpgradeModal';


const templates = [
  { id: 'classic', name: 'Classic', free: true },
  { id: 'modern', name: 'Modern Blue', free: true },
  { id: 'creative', name: 'Creative', free: true },
  { id: 'minimal', name: 'Minimal', free: false },
  { id: 'executive', name: 'Executive', free: false },
  { id: 'stockholm', name: 'Stockholm', free: false },
  { id: 'newyork', name: 'New York', free: false },
  { id: 'tokyo', name: 'Tokyo', free: false },
  { id: 'paris', name: 'Paris', free: false },
  { id: 'london', name: 'London', free: false },
  { id: 'berlin', name: 'Berlin', free: false },
  { id: 'sydney', name: 'Sydney', free: false },
  { id: 'dubai', name: 'Dubai', free: false },
  { id: 'toronto', name: 'Toronto', free: false },
  { id: 'singapore', name: 'Singapore', free: false },
  { id: 'mumbai', name: 'Mumbai', free: false },
  { id: 'chicago', name: 'Chicago', free: false },
  { id: 'amsterdam', name: 'Amsterdam', free: false },
  { id: 'vienna', name: 'Vienna', free: false },
  { id: 'osaka', name: 'Osaka', free: false },
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
  const isPro = user.isPro === true;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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
  };const handleTemplateSelect = (t) => {
  if (!t.free && !isPro) {
    setShowUpgradeModal(true);
    return;
  }
  setActiveTemplate(t.id);
  localStorage.setItem('selectedTemplate', t.id);
};

  const renderPreview = () => {
    switch (activeTemplate) {
      case 'modern': return <ModernTemplate form={form} />;
      case 'creative': return <CreativeTemplate form={form} />;
      case 'minimal': return <MinimalTemplate form={form} />;
      case 'executive': return <ExecutiveTemplate form={form} />;
      case 'stockholm': return <StockholmTemplate form={form} />;
      case 'newyork': return <NewYorkTemplate form={form} />;
      case 'tokyo': return <TokyoTemplate form={form} />;
      case 'paris': return <ParisTemplate form={form} />;
      case 'london': return <LondonTemplate form={form} />;
      case 'berlin': return <BerlinTemplate form={form} />;
      case 'sydney': return <SydneyTemplate form={form} />;
      case 'dubai': return <DubaiTemplate form={form} />;
      case 'toronto': return <TorontoTemplate form={form} />;
      case 'singapore': return <SingaporeTemplate form={form} />;
      case 'mumbai': return <MumbaiTemplate form={form} />;
      case 'chicago': return <ChicagoTemplate form={form} />;
      case 'amsterdam': return <AmsterdamTemplate form={form} />;
      case 'vienna': return <ViennaTemplate form={form} />;
      case 'osaka': return <OsakaTemplate form={form} />;
      default: return <ClassicTemplate form={form} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
       {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
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
          {isPro
    ? <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>💎 Pro</span>
    : <button onClick={() => navigate('/pricing')} style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>⭐ Upgrade to Pro</button>
  }
          <button onClick={handleDownloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Download PDF ⬇
          </button>
          <span className="text-sm text-gray-500">Hi, {user.name || 'User'} 👋</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 52px)' }}>
        <div className="w-96 bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0">
          <div className="p-5 space-y-6">

            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Template (20+)</h2>
              <div className="flex flex-wrap gap-2">
                {templates.map(t => (
                  <button key={t.id} onClick={() => handleTemplateSelect(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${activeTemplate === t.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🎨 Customize</h2>
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
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Font Size: {form.fontSize}px</label>
                <input type="range" min="10" max="14" step="0.5"
                  value={form.fontSize}
                  onChange={e => setForm({ ...form, fontSize: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Small</span><span>Medium</span><span>Large</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">📸 Profile Photo</h3>
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
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">👤 Personal Info</h3>
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
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🛠 Skills</h3>
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="React, Node.js, Python, MongoDB, AWS"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">Separate using commas</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">💼 Work Experience</h3>
              {form.experiences.map((exp, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Experience {i + 1}</span>
                    {form.experiences.length > 1 && <button onClick={() => removeItem('experiences', i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
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
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🎓 Education</h3>
              {form.educations.map((edu, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Education {i + 1}</span>
                    {form.educations.length > 1 && <button onClick={() => removeItem('educations', i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
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
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🚀 Projects</h3>
              {form.projects.map((proj, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Project {i + 1}</span>
                    {form.projects.length > 1 && <button onClick={() => removeItem('projects', i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
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
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🏆 Certifications</h3>
              {form.certifications.map((cert, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Certification {i + 1}</span>
                    {form.certifications.length > 1 && <button onClick={() => removeItem('certifications', i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
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
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🌐 Languages</h3>
              {form.languages.map((lang, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input value={lang.language} onChange={e => handleArrayChange('languages', i, 'language', e.target.value)}
                    placeholder="English"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <select value={lang.level} onChange={e => handleArrayChange('languages', i, 'level', e.target.value)}
                    className="rounded-lg border border-gray-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map(l => <option key={l}>{l}</option>)}
                  </select>
                  {form.languages.length > 1 && <button onClick={() => removeItem('languages', i)} className="text-red-400 hover:text-red-600 text-lg">×</button>}
                </div>
              ))}
              <button onClick={() => addItem('languages', emptyLang)}
                className="w-full text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg py-2 hover:bg-blue-50">
                + Add Language
              </button>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🎯 Hobbies & Interests</h3>
              <input name="hobbies" value={form.hobbies} onChange={handleChange}
                placeholder="Reading, Coding, Cricket, Photography"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center">
          <div id="cv-preview" className="w-full max-w-2xl">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SHARED COMPONENTS =====
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
function GenTitle({ children, color, border }) {
  return <div style={{ fontSize: '11px', fontWeight: 'bold', color: color || '#333', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: border ? `2px solid ${color}` : 'none', paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>{children}</div>;
}

// ===== TEMPLATE 1: CLASSIC =====
function ClassicTemplate({ form }) {
  const accent = form.accentColor || '#000';
  const font = form.fontFamily || "'Times New Roman', serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', padding: '36px 44px', fontFamily: font, fontSize: `${size}px`, color: '#000', minHeight: '842px' }}>
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: '12px', marginBottom: '16px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}`, margin: '0 auto 8px', display: 'block' }} />}
        <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', color: accent }}>{form.name || 'Your Name'}</div>
        <div style={{ fontSize: '10px', color: '#444', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {form.email && <span>✉ {form.email}</span>}
          {form.phone && <span>📞 {form.phone}</span>}
          {form.location && <span>📍 {form.location}</span>}
          {form.linkedin && <span>🔗 {form.linkedin}</span>}
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
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', display: 'block', margin: '0 auto 12px' }} />}
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
        {form.projects.some(p => p.name) && <><ExecTitle color={accent}>Key Projects</ExecTitle>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{proj.desc}</div></div>)}</>}
        {form.educations.some(e => e.degree) && <><ExecTitle color={accent}>Education</ExecTitle>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        {form.certifications.some(c => c.name) && <><ExecTitle color={accent}>Certifications</ExecTitle>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</>}
        {form.languages.some(l => l.language) && <><ExecTitle color={accent}>Languages</ExecTitle><div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>{form.languages.filter(l => l.language).map((l, i) => <span key={i} style={{ fontSize: '10px' }}><strong>{l.language}</strong> — {l.level}</span>)}</div></>}
      </div>
    </div>
  );
}

// ===== TEMPLATE 6: STOCKHOLM =====
function StockholmTemplate({ form }) {
  const accent = form.accentColor || '#0891b2';
  const font = form.fontFamily || "'Helvetica Neue', sans-serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ background: accent, padding: '32px 40px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '26px', fontWeight: 'bold', letterSpacing: '1px' }}>{form.name || 'Your Name'}</div>
            <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '10px', flexWrap: 'wrap', opacity: 0.9 }}>
          {form.email && <span>✉ {form.email}</span>}
          {form.phone && <span>📞 {form.phone}</span>}
          {form.location && <span>📍 {form.location}</span>}
          {form.linkedin && <span>🔗 {form.linkedin}</span>}
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '24px 28px' }}>
          {form.summary && <><GenTitle color={accent} border>Summary</GenTitle><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '16px', fontSize: '11px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><GenTitle color={accent} border>Experience</GenTitle>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.projects.some(p => p.name) && <><GenTitle color={accent} border>Projects</GenTitle>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: accent }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
          {form.educations.some(e => e.degree) && <><GenTitle color={accent} border>Education</GenTitle>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        </div>
        <div style={{ width: '180px', background: '#f8fafc', padding: '24px 16px', borderLeft: '1px solid #e5e7eb' }}>
          {form.skills && <><GenTitle color={accent}>Skills</GenTitle>{form.skills.split(',').map((s, i) => <div key={i} style={{ fontSize: '10px', padding: '3px 0', borderBottom: '1px solid #e5e7eb', color: '#444' }}>{s.trim()}</div>)}</>}
          {form.languages.some(l => l.language) && <><GenTitle color={accent}>Languages</GenTitle>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px', color: '#444' }}>{l.language}<br/><span style={{ color: '#888', fontSize: '9px' }}>{l.level}</span></div>)}</>}
          {form.certifications.some(c => c.name) && <><GenTitle color={accent}>Certifications</GenTitle>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '9px', marginBottom: '6px', color: '#444' }}><div style={{ fontWeight: 'bold' }}>{cert.name}</div><div style={{ color: '#888' }}>{cert.issuer} {cert.year}</div></div>)}</>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 7: NEW YORK =====
function NewYorkTemplate({ form }) {
  const accent = form.accentColor || '#dc2626';
  const font = form.fontFamily || 'Georgia, serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px', padding: '40px' }}>
      <div style={{ borderLeft: `4px solid ${accent}`, paddingLeft: '20px', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '75px', height: '75px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />}
        <div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111', letterSpacing: '1px' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '13px', color: accent, fontWeight: 'bold', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '10px', color: '#666' }}>
            {form.email && <span>{form.email}</span>}
            {form.phone && <span>{form.phone}</span>}
            {form.location && <span>{form.location}</span>}
          </div>
        </div>
      </div>
      {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', marginTop: '16px' }}>Summary</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '16px', borderLeft: `2px solid ${accent}`, paddingLeft: '12px' }}>{form.summary}</p></>}
      {form.skills && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ background: accent, color: '#fff', padding: '2px 10px', fontSize: '10px', borderRadius: '2px' }}>{s.trim()}</span>)}</div></>}
      {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
      {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
      {form.projects.some(p => p.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold' }}>{proj.name} {proj.tech && <span style={{ color: '#888', fontWeight: 'normal', fontSize: '10px' }}>({proj.tech})</span>}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
      {form.certifications.some(c => c.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</>}
      {form.languages.some(l => l.language) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Languages</div><div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>{form.languages.filter(l => l.language).map((l, i) => <span key={i} style={{ fontSize: '10px' }}><strong>{l.language}</strong> — {l.level}</span>)}</div></>}
    </div>
  );
}

// ===== TEMPLATE 8: TOKYO =====
function TokyoTemplate({ form }) {
  const accent = form.accentColor || '#be185d';
  const font = form.fontFamily || 'Arial, sans-serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '220px', background: '#111', color: '#fff', padding: '32px 18px', minHeight: '842px', flexShrink: 0 }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, display: 'block', margin: '0 auto 16px' }} />}
          <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '4px' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '10px', color: accent, textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ fontSize: '9px', lineHeight: '2', marginBottom: '20px', color: '#ccc' }}>
            {form.email && <div>✉ {form.email}</div>}
            {form.phone && <div>📞 {form.phone}</div>}
            {form.location && <div>📍 {form.location}</div>}
            {form.linkedin && <div>🔗 {form.linkedin}</div>}
          </div>
          {form.skills && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderBottom: `1px solid ${accent}`, paddingBottom: '4px' }}>Skills</div>{form.skills.split(',').map((s, i) => <div key={i} style={{ fontSize: '9px', color: '#ddd', padding: '3px 0', borderBottom: '1px solid #333' }}>{s.trim()}</div>)}</>}
          {form.languages.some(l => l.language) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px', borderBottom: `1px solid ${accent}`, paddingBottom: '4px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '9px', color: '#ddd', marginBottom: '4px' }}>{l.language} — {l.level}</div>)}</>}
        </div>
        <div style={{ flex: 1, padding: '32px 24px' }}>
          {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px' }}>Profile</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px' }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.projects.some(p => p.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: '#111' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
          {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
          {form.certifications.some(c => c.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 9: PARIS =====
function ParisTemplate({ form }) {
  const accent = form.accentColor || '#be185d';
  const font = form.fontFamily || 'Georgia, serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fdf8f8', fontFamily: font, fontSize: `${size}px`, minHeight: '842px', padding: '44px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, display: 'block', margin: '0 auto 14px' }} />}
        <div style={{ fontSize: '30px', fontWeight: '300', color: '#222', letterSpacing: '4px', textTransform: 'uppercase' }}>{form.name || 'Your Name'}</div>
        <div style={{ fontSize: '12px', color: accent, marginTop: '6px', letterSpacing: '3px', textTransform: 'uppercase' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
        <div style={{ width: '60px', height: '2px', background: accent, margin: '12px auto' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '10px', color: '#666', flexWrap: 'wrap' }}>
          {form.email && <span>{form.email}</span>}
          {form.phone && <span>{form.phone}</span>}
          {form.location && <span>{form.location}</span>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          {form.summary && <><div style={{ fontSize: '11px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>About</div><p style={{ lineHeight: '1.8', color: '#555', fontSize: '11px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '20px' }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '20px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        </div>
        <div>
          {form.skills && <><div style={{ fontSize: '11px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ border: `1px solid ${accent}`, color: accent, padding: '2px 8px', fontSize: '10px', borderRadius: '20px' }}>{s.trim()}</span>)}</div></>}
          {form.languages.some(l => l.language) && <><div style={{ fontSize: '11px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>{l.language} — {l.level}</div>)}</>}
          {form.projects.some(p => p.name) && <><div style={{ fontSize: '11px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', fontSize: '11px' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#555' }}>{proj.desc}</div></div>)}</>}
          {form.certifications.some(c => c.name) && <><div style={{ fontSize: '11px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}</div>)}</>}
          {form.hobbies && <><div style={{ fontSize: '11px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Interests</div><div style={{ fontSize: '10px', color: '#555' }}>{form.hobbies}</div></>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 10: LONDON =====
function LondonTemplate({ form }) {
  const accent = form.accentColor || '#1d4ed8';
  const font = form.fontFamily || "'Times New Roman', serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ background: '#1e3a5f', color: '#fff', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '70px', height: '70px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />}
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>{form.name || 'Your Name'}</div>
            <div style={{ fontSize: '12px', color: '#93c5fd', marginTop: '4px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          </div>
        </div>
        <div style={{ fontSize: '9px', textAlign: 'right', color: '#cbd5e1', lineHeight: '2' }}>
          {form.email && <div>{form.email}</div>}
          {form.phone && <div>{form.phone}</div>}
          {form.location && <div>{form.location}</div>}
          {form.linkedin && <div>{form.linkedin}</div>}
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '28px 28px' }}>
          {form.summary && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #1e3a5f', paddingBottom: '4px', marginBottom: '10px' }}>Profile</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '18px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #1e3a5f', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Career History</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.projects.some(p => p.name) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #1e3a5f', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: '#1e3a5f' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
          {form.educations.some(e => e.degree) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #1e3a5f', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        </div>
        <div style={{ width: '180px', background: '#f1f5f9', padding: '28px 16px', borderLeft: '1px solid #e2e8f0' }}>
          {form.skills && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Skills</div><div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>{form.skills.split(',').map((s, i) => <div key={i} style={{ fontSize: '10px', color: '#444', padding: '3px 6px', background: '#fff', borderRadius: '3px', border: '1px solid #e2e8f0' }}>{s.trim()}</div>)}</div></>}
          {form.languages.some(l => l.language) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}>{l.language}<br/><span style={{ color: '#888', fontSize: '9px' }}>{l.level}</span></div>)}</>}
          {form.certifications.some(c => c.name) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '9px', color: '#444', marginBottom: '6px' }}><div style={{ fontWeight: 'bold' }}>{cert.name}</div><div style={{ color: '#888' }}>{cert.issuer}</div></div>)}</>}
          {form.hobbies && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px' }}>Interests</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{form.hobbies}</div></>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 11: BERLIN =====
function BerlinTemplate({ form }) {
  const accent = form.accentColor || '#059669';
  const font = form.fontFamily || "'Helvetica Neue', sans-serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px', padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '28px', paddingBottom: '20px', borderBottom: `3px solid ${accent}` }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '85px', height: '85px', borderRadius: '0', objectFit: 'cover', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '30px', fontWeight: '300', color: '#111', letterSpacing: '2px', textTransform: 'uppercase' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '12px', color: accent, fontWeight: 'bold', marginTop: '4px', letterSpacing: '2px', textTransform: 'uppercase' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
        </div>
        <div style={{ fontSize: '9px', color: '#666', textAlign: 'right', lineHeight: '1.8' }}>
          {form.email && <div>{form.email}</div>}
          {form.phone && <div>{form.phone}</div>}
          {form.location && <div>{form.location}</div>}
          {form.linkedin && <div>{form.linkedin}</div>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        <div>
          {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Profile</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.projects.some(p => p.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
          {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        </div>
        <div>
          {form.skills && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Skills</div><div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>{form.skills.split(',').map((s, i) => <div key={i} style={{ fontSize: '10px', color: '#444', padding: '4px 8px', borderLeft: `3px solid ${accent}`, background: '#f9fafb' }}>{s.trim()}</div>)}</div></>}
          {form.languages.some(l => l.language) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '5px' }}>{l.language} — {l.level}</div>)}</>}
          {form.certifications.some(c => c.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.year && ` (${cert.year})`}</div>)}</>}
          {form.hobbies && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px' }}>Interests</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{form.hobbies}</div></>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 12: SYDNEY =====
function SydneyTemplate({ form }) {
  const accent = form.accentColor || '#d97706';
  const font = form.fontFamily || 'Arial, sans-serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ background: `${accent}`, padding: '32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)', flexShrink: 0 }} />}
          <div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>{form.name || 'Your Name'}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.8)', flexWrap: 'wrap' }}>
              {form.email && <span>{form.email}</span>}
              {form.phone && <span>{form.phone}</span>}
              {form.location && <span>{form.location}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 40px' }}>
        {form.summary && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderLeft: `4px solid ${accent}`, paddingLeft: '10px' }}>Profile</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '18px', paddingLeft: '14px' }}>{form.summary}</p></>}
        {form.skills && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderLeft: `4px solid ${accent}`, paddingLeft: '10px' }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px', paddingLeft: '14px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ background: `${accent}18`, color: accent, padding: '2px 10px', fontSize: '10px', borderRadius: '3px', border: `1px solid ${accent}40` }}>{s.trim()}</span>)}</div></>}
        {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderLeft: `4px solid ${accent}`, paddingLeft: '10px' }}>Experience</div><div style={{ paddingLeft: '14px' }}>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</div></>}
        {form.educations.some(e => e.degree) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderLeft: `4px solid ${accent}`, paddingLeft: '10px', marginTop: '16px' }}>Education</div><div style={{ paddingLeft: '14px' }}>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</div></>}
        {form.certifications.some(c => c.name) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderLeft: `4px solid ${accent}`, paddingLeft: '10px', marginTop: '16px' }}>Certifications</div><div style={{ paddingLeft: '14px' }}>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</div></>}
        {form.languages.some(l => l.language) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderLeft: `4px solid ${accent}`, paddingLeft: '10px', marginTop: '16px' }}>Languages</div><div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingLeft: '14px' }}>{form.languages.filter(l => l.language).map((l, i) => <span key={i} style={{ fontSize: '10px', color: '#444' }}>{l.language} — {l.level}</span>)}</div></>}
      </div>
    </div>
  );
}

// ===== TEMPLATE 13: DUBAI =====
function DubaiTemplate({ form }) {
  const accent = form.accentColor || '#f59e0b';
  const font = form.fontFamily || 'Georgia, serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#0f172a', fontFamily: font, fontSize: `${size}px`, minHeight: '842px', color: '#fff' }}>
      <div style={{ padding: '36px 44px', borderBottom: `1px solid ${accent}40` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#fff' }}>{form.name || 'Your Name'}</div>
            <div style={{ fontSize: '12px', color: accent, marginTop: '6px', letterSpacing: '2px', textTransform: 'uppercase' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '9px', color: '#94a3b8', flexWrap: 'wrap' }}>
              {form.email && <span>✉ {form.email}</span>}
              {form.phone && <span>📞 {form.phone}</span>}
              {form.location && <span>📍 {form.location}</span>}
              {form.linkedin && <span>🔗 {form.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 44px' }}>
        {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '4px' }}>Executive Profile</div><p style={{ lineHeight: '1.8', color: '#cbd5e1', marginBottom: '20px' }}>{form.summary}</p></>}
        {form.skills && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Expertise</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ background: `${accent}20`, color: accent, padding: '3px 12px', fontSize: '10px', border: `1px solid ${accent}40` }}>{s.trim()}</span>)}</div></>}
        {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Career</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <div key={i} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontWeight: 'bold', color: '#fff' }}>{exp.jobTitle}</div><div style={{ fontSize: '10px', color: accent }}>{exp.company}</div></div><div style={{ fontSize: '10px', color: '#94a3b8' }}>{exp.years}</div></div><ul style={{ marginTop: '5px', paddingLeft: '14px' }}>{exp.jobDesc.split('\n').filter(l => l.trim()).map((line, i) => <li key={i} style={{ lineHeight: '1.7', color: '#cbd5e1', listStyle: 'disc', fontSize: '10px' }}>{line.replace(/^[-•]\s*/, '')}</li>)}</ul></div>)}</>}
        {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><div><div style={{ fontWeight: 'bold', color: '#fff', fontSize: '11px' }}>{edu.degree}</div><div style={{ color: '#94a3b8', fontSize: '10px', fontStyle: 'italic' }}>{edu.college}</div></div><div style={{ fontSize: '10px', color: '#94a3b8' }}>{edu.gradYear}</div></div>)}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
          {form.certifications.some(c => c.name) && <div><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', color: '#cbd5e1', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.year && ` (${cert.year})`}</div>)}</div>}
          {form.languages.some(l => l.language) && <div><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', color: '#cbd5e1', marginBottom: '4px' }}>{l.language} — {l.level}</div>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 14: TORONTO =====
function TorontoTemplate({ form }) {
  const accent = form.accentColor || '#dc2626';
  const font = form.fontFamily || 'Arial, sans-serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px', padding: '40px' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '13px', color: accent, fontWeight: 'bold', marginTop: '2px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '10px', color: '#666', flexWrap: 'wrap' }}>
            {form.email && <span>✉ {form.email}</span>}
            {form.phone && <span>📞 {form.phone}</span>}
            {form.location && <span>📍 {form.location}</span>}
            {form.linkedin && <span>🔗 {form.linkedin}</span>}
          </div>
        </div>
      </div>
      <div style={{ height: '2px', background: accent, marginBottom: '20px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Summary</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '16px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '16px' }}>Work Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.projects.some(p => p.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
          {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        </div>
        <div>
          {form.skills && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Skills</div><div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>{form.skills.split(',').map((s, i) => <div key={i} style={{ fontSize: '10px', color: '#444', padding: '4px 8px', background: '#f9fafb', borderRadius: '4px', border: `1px solid #e5e7eb` }}>{s.trim()}</div>)}</div></>}
          {form.certifications.some(c => c.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '6px' }}><div style={{ fontWeight: 'bold' }}>{cert.name}</div><div style={{ color: '#888' }}>{cert.issuer} {cert.year}</div></div>)}</>}
          {form.languages.some(l => l.language) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}>{l.language} — {l.level}</div>)}</>}
          {form.hobbies && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px' }}>Interests</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{form.hobbies}</div></>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 15: SINGAPORE =====
function SingaporeTemplate({ form }) {
  const accent = form.accentColor || '#0891b2';
  const font = form.fontFamily || "'Helvetica Neue', sans-serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#f0f9ff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ background: '#fff', margin: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ background: accent, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)', flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>{form.name || 'Your Name'}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginTop: '3px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          </div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', textAlign: 'right', lineHeight: '2' }}>
            {form.email && <div>{form.email}</div>}
            {form.phone && <div>{form.phone}</div>}
            {form.location && <div>{form.location}</div>}
          </div>
        </div>
        <div style={{ padding: '20px 28px' }}>
          {form.summary && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', borderBottom: `1px solid ${accent}30`, paddingBottom: '4px' }}>Profile</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '14px', fontSize: '11px' }}>{form.summary}</p></>}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>
            <div>
              {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', borderBottom: `1px solid ${accent}30`, paddingBottom: '4px' }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
              {form.projects.some(p => p.name) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', borderBottom: `1px solid ${accent}30`, paddingBottom: '4px', marginTop: '14px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', fontSize: '11px' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
              {form.educations.some(e => e.degree) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', borderBottom: `1px solid ${accent}30`, paddingBottom: '4px', marginTop: '14px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
            </div>
            <div>
              {form.skills && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', borderBottom: `1px solid ${accent}30`, paddingBottom: '4px' }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ background: `${accent}15`, color: accent, padding: '2px 8px', fontSize: '9px', borderRadius: '3px' }}>{s.trim()}</span>)}</div></>}
              {form.languages.some(l => l.language) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', borderBottom: `1px solid ${accent}30`, paddingBottom: '4px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}>{l.language} — {l.level}</div>)}</>}
              {form.certifications.some(c => c.name) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', borderBottom: `1px solid ${accent}30`, paddingBottom: '4px', marginTop: '14px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '9px', color: '#444', marginBottom: '4px' }}><div style={{ fontWeight: 'bold' }}>{cert.name}</div><div style={{ color: '#888' }}>{cert.issuer}</div></div>)}</>}
              {form.hobbies && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', borderBottom: `1px solid ${accent}30`, paddingBottom: '4px', marginTop: '14px' }}>Interests</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{form.hobbies}</div></>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 16: MUMBAI =====
function MumbaiTemplate({ form }) {
  const accent = form.accentColor || '#7c3aed';
  const font = form.fontFamily || 'Arial, sans-serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ display: 'flex', minHeight: '842px' }}>
        <div style={{ width: '200px', background: `${accent}10`, borderRight: `3px solid ${accent}`, padding: '28px 16px', flexShrink: 0 }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, display: 'block', margin: '0 auto 16px' }} />}
          <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', color: '#111', marginBottom: '4px' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '10px', color: accent, textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ fontSize: '9px', lineHeight: '2', color: '#555', marginBottom: '20px' }}>
            {form.email && <div>✉ {form.email}</div>}
            {form.phone && <div>📞 {form.phone}</div>}
            {form.location && <div>📍 {form.location}</div>}
            {form.linkedin && <div>🔗 {form.linkedin}</div>}
          </div>
          {form.skills && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Skills</div><div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{form.skills.split(',').map((s, i) => <div key={i} style={{ fontSize: '9px', background: `${accent}20`, color: accent, padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>{s.trim()}</div>)}</div></>}
          {form.languages.some(l => l.language) && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '9px', color: '#555', marginBottom: '4px' }}>{l.language} — {l.level}</div>)}</>}
          {form.hobbies && <><div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px' }}>Interests</div><div style={{ fontSize: '9px', color: '#555', lineHeight: '1.6' }}>{form.hobbies}</div></>}
        </div>
        <div style={{ flex: 1, padding: '28px 24px' }}>
          {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingBottom: '4px', borderBottom: `2px solid ${accent}` }}>About Me</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '18px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingBottom: '4px', borderBottom: `2px solid ${accent}` }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.projects.some(p => p.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingBottom: '4px', borderBottom: `2px solid ${accent}`, marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: accent }}>{proj.name} {proj.tech && <span style={{ color: '#888', fontWeight: 'normal', fontSize: '10px' }}>({proj.tech})</span>}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
          {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingBottom: '4px', borderBottom: `2px solid ${accent}`, marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
          {form.certifications.some(c => c.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingBottom: '4px', borderBottom: `2px solid ${accent}`, marginTop: '16px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}><strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}</div>)}</>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 17: CHICAGO =====
function ChicagoTemplate({ form }) {
  const accent = form.accentColor || '#1d4ed8';
  const font = form.fontFamily || "'Times New Roman', serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px', padding: '44px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, display: 'block', margin: '0 auto 12px' }} />}
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111', letterSpacing: '2px', textTransform: 'uppercase' }}>{form.name || 'Your Name'}</div>
        <div style={{ fontSize: '12px', color: accent, marginTop: '4px', letterSpacing: '3px', textTransform: 'uppercase' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '10px', color: '#666' }}>
          {form.email && <span>{form.email}</span>}
          {form.phone && <span>{form.phone}</span>}
          {form.location && <span>{form.location}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0', justifyContent: 'center' }}>
          <div style={{ flex: 1, height: '1px', background: accent }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent }} />
          <div style={{ flex: 1, height: '1px', background: accent }} />
        </div>
      </div>
      {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', marginBottom: '8px' }}>Profile</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '16px', textAlign: 'center', fontStyle: 'italic' }}>{form.summary}</p><div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 16px' }}><div style={{ flex: 1, height: '0.5px', background: '#e5e7eb' }} /></div></>}
      {form.skills && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', marginBottom: '8px' }}>Skills</div><div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ border: `1px solid ${accent}`, color: accent, padding: '2px 10px', fontSize: '10px' }}>{s.trim()}</span>)}</div><div style={{ height: '0.5px', background: '#e5e7eb', marginBottom: '16px' }} /></>}
      {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', marginBottom: '10px' }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}<div style={{ height: '0.5px', background: '#e5e7eb', marginBottom: '16px' }} /></>}
      {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', marginBottom: '10px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
      {form.languages.some(l => l.language) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', marginBottom: '8px', marginTop: '16px' }}>Languages</div><div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>{form.languages.filter(l => l.language).map((l, i) => <span key={i} style={{ fontSize: '10px', color: '#444' }}>{l.language} — {l.level}</span>)}</div></>}
    </div>
  );
}

// ===== TEMPLATE 18: AMSTERDAM =====
function AmsterdamTemplate({ form }) {
  const accent = form.accentColor || '#059669';
  const font = form.fontFamily || "'Helvetica Neue', sans-serif";
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ display: 'flex', minHeight: '842px' }}>
        <div style={{ width: '190px', background: '#111', padding: '32px 18px', flexShrink: 0 }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '85px', height: '85px', borderRadius: '4px', objectFit: 'cover', border: `2px solid ${accent}`, display: 'block', margin: '0 auto 16px' }} />}
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: '4px' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '9px', color: accent, textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ fontSize: '9px', lineHeight: '2', color: '#aaa', marginBottom: '20px' }}>
            {form.email && <div>✉ {form.email}</div>}
            {form.phone && <div>📞 {form.phone}</div>}
            {form.location && <div>📍 {form.location}</div>}
          </div>
          {form.skills && <><div style={{ fontSize: '9px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderBottom: `1px solid ${accent}40`, paddingBottom: '4px' }}>Skills</div><div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{form.skills.split(',').map((s, i) => <div key={i} style={{ fontSize: '9px', color: '#ccc', padding: '3px 0', borderBottom: '1px solid #222' }}>{s.trim()}</div>)}</div></>}
          {form.languages.some(l => l.language) && <><div style={{ fontSize: '9px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px', borderBottom: `1px solid ${accent}40`, paddingBottom: '4px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '9px', color: '#ccc', marginBottom: '4px' }}>{l.language} — {l.level}</div>)}</>}
          {form.certifications.some(c => c.name) && <><div style={{ fontSize: '9px', color: accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', marginTop: '16px', borderBottom: `1px solid ${accent}40`, paddingBottom: '4px' }}>Certs</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '8px', color: '#ccc', marginBottom: '4px' }}>{cert.name}</div>)}</>}
        </div>
        <div style={{ flex: 1, padding: '32px 24px' }}>
          {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px' }}>Profile</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '18px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px' }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.projects.some(p => p.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
          {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
          {form.hobbies && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginTop: '16px' }}>Interests</div><div style={{ fontSize: '10px', color: '#444' }}>{form.hobbies}</div></>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 19: VIENNA =====
function ViennaTemplate({ form }) {
  const accent = form.accentColor || '#7c3aed';
  const font = form.fontFamily || 'Georgia, serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#faf9ff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px', padding: '44px' }}>
      <div style={{ borderBottom: `3px double ${accent}`, paddingBottom: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {form.photo && <img src={form.photo} alt="profile" style={{ width: '85px', height: '85px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#111', letterSpacing: '1px' }}>{form.name || 'Your Name'}</div>
            <div style={{ fontSize: '13px', color: accent, marginTop: '4px', fontStyle: 'italic' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          </div>
          <div style={{ fontSize: '10px', color: '#666', textAlign: 'right', lineHeight: '1.8' }}>
            {form.email && <div>{form.email}</div>}
            {form.phone && <div>{form.phone}</div>}
            {form.location && <div>{form.location}</div>}
            {form.linkedin && <div>{form.linkedin}</div>}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        <div>
          {form.summary && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, fontStyle: 'italic', marginBottom: '8px' }}>Profile</div><p style={{ lineHeight: '1.8', color: '#555', marginBottom: '18px', borderLeft: `2px solid ${accent}30`, paddingLeft: '12px' }}>{form.summary}</p></>}
          {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, fontStyle: 'italic', marginBottom: '8px', marginTop: '16px' }}>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
          {form.projects.some(p => p.name) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, fontStyle: 'italic', marginBottom: '8px', marginTop: '16px' }}>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#555' }}>{proj.desc}</div></div>)}</>}
          {form.educations.some(e => e.degree) && <><div style={{ fontSize: '12px', fontWeight: 'bold', color: accent, fontStyle: 'italic', marginBottom: '8px', marginTop: '16px' }}>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
        </div>
        <div>
          {form.skills && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, fontStyle: 'italic', marginBottom: '8px' }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>{form.skills.split(',').map((s, i) => <span key={i} style={{ background: `${accent}15`, color: accent, padding: '2px 8px', fontSize: '10px', borderRadius: '12px', border: `1px solid ${accent}30` }}>{s.trim()}</span>)}</div></>}
          {form.languages.some(l => l.language) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, fontStyle: 'italic', marginBottom: '8px', marginTop: '16px' }}>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', color: '#555', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span>{l.language}</span><span style={{ color: '#888', fontStyle: 'italic' }}>{l.level}</span></div>)}</>}
          {form.certifications.some(c => c.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, fontStyle: 'italic', marginBottom: '8px', marginTop: '16px' }}>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', color: '#555', marginBottom: '6px' }}><div style={{ fontWeight: 'bold' }}>{cert.name}</div><div style={{ color: '#888', fontStyle: 'italic' }}>{cert.issuer}</div></div>)}</>}
          {form.hobbies && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, fontStyle: 'italic', marginBottom: '8px', marginTop: '16px' }}>Interests</div><div style={{ fontSize: '10px', color: '#555', lineHeight: '1.6' }}>{form.hobbies}</div></>}
        </div>
      </div>
    </div>
  );
}

// ===== TEMPLATE 20: OSAKA =====
function OsakaTemplate({ form }) {
  const accent = form.accentColor || '#be185d';
  const font = form.fontFamily || 'Arial, sans-serif';
  const size = form.fontSize || 12;
  return (
    <div style={{ background: '#fff', fontFamily: font, fontSize: `${size}px`, minHeight: '842px' }}>
      <div style={{ background: `linear-gradient(to right, #111, #222)`, padding: '32px 40px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        {form.photo && <img src={form.photo} alt="profile" style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#fff', letterSpacing: '2px' }}>{form.name || 'Your Name'}</div>
          <div style={{ fontSize: '12px', color: accent, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>{form.experiences[0]?.jobTitle || 'Professional'}</div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '9px', color: '#aaa', flexWrap: 'wrap' }}>
            {form.email && <span>{form.email}</span>}
            {form.phone && <span>{form.phone}</span>}
            {form.location && <span>{form.location}</span>}
          </div>
        </div>
        {form.skills && <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '140px' }}>
          {form.skills.split(',').slice(0, 5).map((s, i) => <span key={i} style={{ background: `${accent}30`, color: accent, padding: '2px 8px', fontSize: '9px', borderRadius: '2px', border: `1px solid ${accent}50`, textAlign: 'center' }}>{s.trim()}</span>)}
        </div>}
      </div>
      <div style={{ padding: '28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '28px' }}>
          <div>
            {form.summary && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '20px', height: '2px', background: accent, display: 'inline-block' }}></span>Profile</div><p style={{ lineHeight: '1.8', color: '#444', marginBottom: '18px' }}>{form.summary}</p></>}
            {form.experiences.some(e => e.jobTitle) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '20px', height: '2px', background: accent, display: 'inline-block' }}></span>Experience</div>{form.experiences.filter(e => e.jobTitle).map((exp, i) => <ExpItem key={i} exp={exp} accentColor={accent} />)}</>}
            {form.projects.some(p => p.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '20px', height: '2px', background: accent, display: 'inline-block' }}></span>Projects</div>{form.projects.filter(p => p.name).map((proj, i) => <div key={i} style={{ marginBottom: '8px' }}><div style={{ fontWeight: 'bold', color: '#111' }}>{proj.name}</div><div style={{ fontSize: '10px', color: '#444' }}>{proj.desc}</div></div>)}</>}
            {form.educations.some(e => e.degree) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '20px', height: '2px', background: accent, display: 'inline-block' }}></span>Education</div>{form.educations.filter(e => e.degree).map((edu, i) => <EduItem key={i} edu={edu} />)}</>}
          </div>
          <div>
            {form.languages.some(l => l.language) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '20px', height: '2px', background: accent, display: 'inline-block' }}></span>Languages</div>{form.languages.filter(l => l.language).map((l, i) => <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>{l.language}</span><span style={{ color: '#888' }}>{l.level}</span></div>)}</>}
            {form.certifications.some(c => c.name) && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '20px', height: '2px', background: accent, display: 'inline-block' }}></span>Certifications</div>{form.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '6px' }}><div style={{ fontWeight: 'bold' }}>{cert.name}</div><div style={{ color: '#888', fontSize: '9px' }}>{cert.issuer} {cert.year}</div></div>)}</>}
            {form.hobbies && <><div style={{ fontSize: '11px', fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '20px', height: '2px', background: accent, display: 'inline-block' }}></span>Interests</div><div style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{form.hobbies}</div></>}
          </div>
        </div>
      </div>
    </div>
  );
}