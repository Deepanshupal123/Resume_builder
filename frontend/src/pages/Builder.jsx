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
  
  // Tab and Layout states
  const [activeTab, setActiveTab] = useState('style');
  const [layoutMode, setLayoutMode] = useState('split'); // 'split', 'editor', 'preview'
  const [expandedExperienceIndex, setExpandedExperienceIndex] = useState(0);
  const [expandedEducationIndex, setExpandedEducationIndex] = useState(0);
  const [templateCategory, setTemplateCategory] = useState('all'); // 'all', 'free', 'pro'
  const [templateSearch, setTemplateSearch] = useState('');

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

  const handleTemplateSelect = (t) => {
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

  // Compute profile completion percentage
  const computeCompletion = () => {
    let filled = 0;
    let total = 6;
    if (form.name?.trim()) filled++;
    if (form.email?.trim()) filled++;
    if (form.phone?.trim()) filled++;
    if (form.experiences?.some(e => e.jobTitle?.trim())) filled++;
    if (form.educations?.some(e => e.degree?.trim())) filled++;
    if (form.skills?.trim()) filled++;
    return Math.round((filled / total) * 100);
  };

  // Filter templates list based on search and category inputs
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase());
    if (templateCategory === 'free') return matchesSearch && t.free;
    if (templateCategory === 'pro') return matchesSearch && !t.free;
    return matchesSearch;
  });

  // Define tab navigation buttons with high-quality custom SVGs
  const tabs = [
    {
      id: 'style',
      label: 'Design',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="9" y1="9" x2="21" y2="9" />
        </svg>
      )
    },
    {
      id: 'personal',
      label: 'Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: 'experience',
      label: 'Work',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      id: 'education',
      label: 'Education',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      )
    },
    {
      id: 'skills',
      label: 'Skills &+',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    }
  ];

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <style>{`
        html, body {
          overflow: hidden;
          height: 100%;
          margin: 0;
        }
        input, textarea, select {
          color: #1e293b !important;
          -webkit-text-fill-color: #1e293b !important;
          background-color: #ffffff !important;
          opacity: 1 !important;
        }
        input::placeholder, textarea::placeholder {
          color: #94a3b8 !important;
          -webkit-text-fill-color: #94a3b8 !important;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      
      {/* Visual Glassmorphic Top Bar Header */}
      <div className="backdrop-blur-md bg-white/95 border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-100/50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-all active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              <span className="text-white text-sm font-black tracking-wider">R</span>
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight">Resume<span className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded-md ml-0.5 font-bold">AI</span></span>
          </div>
        </div>
        
        {/* Workspace Layout Mode Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-0.5 shadow-sm">
          {[
            { id: 'split', label: 'Split Screen', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 3v18" />
              </svg>
            )},
            { id: 'editor', label: 'Editor Focus', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
              </svg>
            )},
            { id: 'preview', label: 'Preview Focus', icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          ].map(m => (
            <button key={m.id} onClick={() => setLayoutMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${layoutMode === m.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m.icon}
              <span className="hidden md:inline">{m.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {isPro ? (
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center gap-1 animate-pulse">
              💎 Premium Pro
            </span>
          ) : (
            <button onClick={() => navigate('/pricing')} className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-4 py-1.5 text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
              ⭐ Upgrade to Pro
            </button>
          )}
          
          <button onClick={handleDownloadPDF} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/10 transition-all flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>
          
          <span className="text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
            Hi, <span className="text-slate-800 font-bold">{user.name || 'User'}</span> 👋
          </span>
          
          <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all font-bold">
            Logout
          </button>
        </div>
      </div>

      {/* Editor Body Grid */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 61px)' }}>
        
        {/* Modern Tabbed Sidebar (Expands when layout mode is Editor Focus) */}
        {layoutMode !== 'preview' && (
          <div className={`bg-white border-r border-slate-150 flex-shrink-0 flex overflow-hidden transition-all duration-300 ${layoutMode === 'editor' ? 'flex-1' : 'w-[420px]'}`}>
            
            {/* Left Vertical Icon Menu (70px) */}
            <div className="w-[70px] bg-slate-900 flex flex-col items-center py-5 gap-3 flex-shrink-0 overflow-y-auto h-full no-scrollbar">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`w-[54px] h-[54px] flex flex-col items-center justify-center gap-1 rounded-2xl relative transition-all active:scale-90 ${activeTab === t.id ? 'text-indigo-400 bg-slate-800/80 shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}`}
                >
                  {activeTab === t.id && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r" />
                  )}
                  {t.icon}
                  <span className="text-[9px] font-extrabold uppercase tracking-wider">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Right Active Form Pane (Fills the rest of the sidebar) */}
            <div className={`flex-1 overflow-y-auto p-5 space-y-6 bg-white ${layoutMode === 'editor' ? 'max-w-2xl mx-auto' : ''}`}>
              
              {/* Dynamic Resume Completion Meter */}
              <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-1">
                    📋 Profile Completion
                  </span>
                  <span className="text-xs font-black text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                    {computeCompletion()}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${computeCompletion()}%` }} />
                </div>
              </div>

              {/* Tab: Appearance & Styling */}
              {activeTab === 'style' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Templates</h3>
                    
                    {/* Category Filter and Search */}
                    <div className="space-y-2 mb-4">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                        <input type="text" placeholder="Search templates..." value={templateSearch} onChange={e => setTemplateSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                      </div>
                      
                      <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px]">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'free', label: 'Free' },
                          { id: 'pro', label: 'Premium' }
                        ].map(cat => (
                          <button key={cat.id} type="button" onClick={() => setTemplateCategory(cat.id)}
                            className={`flex-1 py-1 rounded-lg font-extrabold transition-all ${templateCategory === cat.id ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {filteredTemplates.length > 0 ? (
                        filteredTemplates.map(t => (
                          <button key={t.id} onClick={() => handleTemplateSelect(t)}
                            className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all relative flex flex-col justify-between h-[76px] shadow-sm ${activeTemplate === t.id ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-600/10' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50'}`}>
                            <span>{t.name}</span>
                            {!t.free && <span className="absolute top-2 right-2 text-[8px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold px-1.5 py-0.5 rounded-full tracking-wide">PRO</span>}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-6 text-xs text-slate-400 font-semibold">
                          No matching templates.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-5">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">🎨 Typography & Colors</h3>
                    
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-500 mb-2 block">Accent Theme Color</label>
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
                            className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer relative shadow-sm ${form.accentColor === c.color ? 'border-slate-800 scale-110 ring-4 ring-indigo-500/20' : 'border-transparent hover:scale-105'}`}
                          >
                            {form.accentColor === c.color && (
                              <svg className="w-4 h-4 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Font Typography</label>
                      <select value={form.fontFamily} onChange={e => setForm({ ...form, fontFamily: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold bg-white shadow-sm">
                        <option value="'Times New Roman', serif">Classic Serif</option>
                        <option value="Arial, sans-serif">Modern Sans</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Helvetica Neue', sans-serif">Helvetica</option>
                        <option value="'Courier New', monospace">Courier (Tech)</option>
                        <option value="Garamond, serif">Garamond</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-500 mb-1 block flex justify-between">
                        <span>Font Size</span>
                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-black">{form.fontSize}px</span>
                      </label>
                      <input type="range" min="10" max="14" step="0.5"
                        value={form.fontSize}
                        onChange={e => setForm({ ...form, fontSize: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase mt-1">
                        <span>Small</span><span>Medium</span><span>Large</span>
                      </div>
                    </div>
                  </div>

                  {/* Wizard Footer */}
                  <div className="border-t border-slate-100 pt-4 flex justify-end">
                    <button type="button" onClick={() => setActiveTab('personal')}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      Next: Profile
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Personal Info */}
              {activeTab === 'personal' && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">📸 Profile Photo</h3>
                    <div className="flex items-center gap-4 p-4 bg-slate-50/60 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="relative group flex-shrink-0">
                        {form.photo ? (
                          <img src={form.photo} alt="profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md transition-all" />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-350 flex items-center justify-center text-slate-400 text-3xl shadow-inner font-light">
                            👤
                          </div>
                        )}
                      </div>
                      <div>
                        <button onClick={() => photoRef.current.click()}
                          className="text-xs bg-indigo-600 text-white px-3.5 py-2 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all font-bold shadow-sm inline-flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          Upload Photo
                        </button>
                        {form.photo && (
                          <button onClick={() => setForm({ ...form, photo: null })} className="ml-2 text-xs bg-white border border-red-200 text-red-600 px-3.5 py-2 rounded-xl hover:bg-red-50 transition-all font-bold shadow-sm">
                            Remove
                          </button>
                        )}
                        <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">JPG, PNG — Max 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">👤 Contact & Summary</h3>
                    {[
                      { name: 'name', label: 'Full Name', placeholder: 'John Smith' },
                      { name: 'email', label: 'Email Address', placeholder: 'john@email.com' },
                      { name: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210' },
                      { name: 'location', label: 'Location', placeholder: 'Delhi, India' },
                      { name: 'linkedin', label: 'LinkedIn Profile', placeholder: 'linkedin.com/in/john' },
                      { name: 'website', label: 'Portfolio Website', placeholder: 'johndoe.com' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="text-[11px] font-bold text-slate-500 mb-1 block">{f.label}</label>
                        <input name={f.name} value={form[f.name]} onChange={handleChange}
                          placeholder={f.placeholder}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white" />
                      </div>
                    ))}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">Professional Summary</label>
                      <textarea name="summary" value={form.summary} onChange={handleChange}
                        placeholder="Experienced developer with 3+ years..." rows={4}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white" />
                    </div>
                  </div>

                  {/* Wizard Footer */}
                  <div className="border-t border-slate-100 pt-4 flex justify-between">
                    <button type="button" onClick={() => setActiveTab('style')}
                      className="border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      Back
                    </button>
                    <button type="button" onClick={() => setActiveTab('experience')}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      Next: Work History
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Work Experience */}
              {activeTab === 'experience' && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">💼 Work History</h3>
                  
                  <div className="space-y-4">
                    {form.experiences.map((exp, i) => {
                      const isExpanded = expandedExperienceIndex === i;
                      return (
                        <div key={i} className="border border-slate-150 rounded-2xl bg-slate-50/50 shadow-sm overflow-hidden hover:border-slate-200 transition-all">
                          {/* Accordion Header */}
                          <div onClick={() => setExpandedExperienceIndex(isExpanded ? -1 : i)}
                            className="flex justify-between items-center p-4 bg-white border-b border-slate-100 cursor-pointer select-none hover:bg-slate-50/50 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">#{i + 1}</span>
                              <span className="text-xs font-extrabold text-slate-800 truncate max-w-[150px]">
                                {exp.jobTitle || 'New Position'} {exp.company ? `@ ${exp.company}` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {form.experiences.length > 1 && (
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('experiences', i); }}
                                  className="text-xs text-red-500 hover:text-red-750 font-semibold p-1 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Accordion Body */}
                          {isExpanded && (
                            <div className="p-4 space-y-3 bg-white border-t border-slate-50 animate-fadeIn">
                              {[
                                { key: 'jobTitle', placeholder: 'Software Developer', label: 'Job Title' },
                                { key: 'company', placeholder: 'Company Name', label: 'Company' },
                                { key: 'years', placeholder: 'Jan 2023 - Present', label: 'Duration' },
                              ].map(f => (
                                <div key={f.key}>
                                  <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">{f.label}</label>
                                  <input value={exp[f.key] || ''} onChange={e => handleArrayChange('experiences', i, f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white" />
                                </div>
                              ))}
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">Description</label>
                                <textarea value={exp.jobDesc || ''} onChange={e => handleArrayChange('experiences', i, 'jobDesc', e.target.value)}
                                  placeholder="- Built React dashboard&#10;- Integrated REST APIs" rows={3}
                                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={() => { addItem('experiences', emptyExp); setExpandedExperienceIndex(form.experiences.length); }}
                    className="w-full text-sm text-indigo-600 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl py-3 hover:bg-indigo-50 hover:border-indigo-300 transition-all font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Experience
                  </button>

                  {/* Wizard Footer */}
                  <div className="border-t border-slate-100 pt-4 flex justify-between">
                    <button type="button" onClick={() => setActiveTab('personal')}
                      className="border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      Back
                    </button>
                    <button type="button" onClick={() => setActiveTab('education')}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      Next: Education
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Education */}
              {activeTab === 'education' && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">🎓 Education</h3>
                  
                  <div className="space-y-4">
                    {form.educations.map((edu, i) => {
                      const isExpanded = expandedEducationIndex === i;
                      return (
                        <div key={i} className="border border-slate-150 rounded-2xl bg-slate-50/50 shadow-sm overflow-hidden hover:border-slate-200 transition-all">
                          {/* Accordion Header */}
                          <div onClick={() => setExpandedEducationIndex(isExpanded ? -1 : i)}
                            className="flex justify-between items-center p-4 bg-white border-b border-slate-100 cursor-pointer select-none hover:bg-slate-50/50 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">#{i + 1}</span>
                              <span className="text-xs font-extrabold text-slate-800 truncate max-w-[150px]">
                                {edu.degree || 'New Degree'} {edu.college ? `@ ${edu.college}` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {form.educations.length > 1 && (
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('educations', i); }}
                                  className="text-xs text-red-500 hover:text-red-750 font-semibold p-1 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Accordion Body */}
                          {isExpanded && (
                            <div className="p-4 space-y-3 bg-white border-t border-slate-50 animate-fadeIn">
                              {[
                                { key: 'degree', placeholder: 'B.Tech Computer Science', label: 'Degree / Program' },
                                { key: 'college', placeholder: 'COER University', label: 'School / University' },
                                { key: 'gradYear', placeholder: '2025', label: 'Graduation Year' },
                              ].map(f => (
                                <div key={f.key}>
                                  <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">{f.label}</label>
                                  <input value={edu[f.key] || ''} onChange={e => handleArrayChange('educations', i, f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={() => { addItem('educations', emptyEdu); setExpandedEducationIndex(form.educations.length); }}
                    className="w-full text-sm text-indigo-600 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl py-3 hover:bg-indigo-50 hover:border-indigo-300 transition-all font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Education
                  </button>

                  {/* Wizard Footer */}
                  <div className="border-t border-slate-100 pt-4 flex justify-between">
                    <button type="button" onClick={() => setActiveTab('experience')}
                      className="border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      Back
                    </button>
                    <button type="button" onClick={() => setActiveTab('skills')}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      Next: Skills & More
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Skills & Dynamic Arrays (Certs, Projects, Langs, Hobbies) */}
              {activeTab === 'skills' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Skills */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-indigo-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 1021 17.25l-5.83-5.83m0 0a2.67 2.67 0 11-3.75-3.75 2.67 2.67 0 013.75 3.75z" />
                      </svg>
                      Skills List
                    </h4>
                    <input name="skills" value={form.skills} onChange={handleChange}
                      placeholder="React, Node.js, Python, MongoDB, AWS"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white" />
                    <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">Separate multiple skills with commas</p>
                  </div>

                  {/* Projects */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-indigo-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                      </svg>
                      Projects
                    </h4>
                    {form.projects.map((proj, i) => (
                      <div key={i} className="border border-slate-100 rounded-xl p-3.5 mb-3 bg-white shadow-sm hover:border-slate-200 transition-all">
                        <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-100">
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200 shadow-inner">Project #{i + 1}</span>
                          {form.projects.length > 1 && (
                            <button onClick={() => removeItem('projects', i)} className="text-xs text-red-500 hover:text-red-750 font-semibold transition-all">
                              Remove
                            </button>
                          )}
                        </div>
                        {[
                          { key: 'name', placeholder: 'ResumeAI', label: 'Project Name' },
                          { key: 'tech', placeholder: 'React, Node.js, MongoDB', label: 'Technologies Used' },
                        ].map(f => (
                          <div key={f.key} className="mb-2">
                            <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">{f.label}</label>
                            <input value={proj[f.key] || ''} onChange={e => handleArrayChange('projects', i, f.key, e.target.value)}
                              placeholder={f.placeholder}
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white" />
                          </div>
                        ))}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">Description</label>
                          <textarea value={proj.desc || ''} onChange={e => handleArrayChange('projects', i, 'desc', e.target.value)}
                            placeholder="AI-powered resume builder..." rows={2}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white" />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => addItem('projects', emptyProject)}
                      className="w-full text-xs text-indigo-600 bg-white border border-indigo-200 rounded-xl py-2 mt-1 hover:bg-indigo-50 transition-all font-semibold flex items-center justify-center gap-1 shadow-sm">
                      + Add Project
                    </button>
                  </div>

                  {/* Certifications */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-indigo-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                      Certifications
                    </h4>
                    {form.certifications.map((cert, i) => (
                      <div key={i} className="border border-slate-100 rounded-xl p-3.5 mb-3 bg-white shadow-sm hover:border-slate-200 transition-all">
                        <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-100">
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200 shadow-inner">Certificate #{i + 1}</span>
                          {form.certifications.length > 1 && (
                            <button onClick={() => removeItem('certifications', i)} className="text-xs text-red-500 hover:text-red-750 font-semibold transition-all">
                              Remove
                            </button>
                          )}
                        </div>
                        {[
                          { key: 'name', placeholder: 'AWS Solutions Architect', label: 'Certificate Name' },
                          { key: 'issuer', placeholder: 'Amazon Web Services', label: 'Issuer' },
                          { key: 'year', placeholder: '2024', label: 'Year' },
                        ].map(f => (
                          <div key={f.key} className="mb-2">
                            <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">{f.label}</label>
                            <input value={cert[f.key] || ''} onChange={e => handleArrayChange('certifications', i, f.key, e.target.value)}
                              placeholder={f.placeholder}
                              className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white" />
                          </div>
                        ))}
                      </div>
                    ))}
                    <button onClick={() => addItem('certifications', emptyCert)}
                      className="w-full text-xs text-indigo-600 bg-white border border-indigo-200 rounded-xl py-2 mt-1 hover:bg-indigo-50 transition-all font-semibold flex items-center justify-center gap-1 shadow-sm">
                      + Add Certification
                    </button>
                  </div>

                  {/* Languages */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-indigo-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21a.75.75 0 01-.75-.75 2.25 2.25 0 00-2.25-2.25.75.75 0 010-1.5h1.5a.75.75 0 00.75-.75v-1.5a.75.75 0 011.5 0v1.5a2.25 2.25 0 002.25 2.25.75.75 0 010 1.5h-1.5a.75.75 0 00-.75.75v1.5a.75.75 0 01-.75.75z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18zm0-1.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                      </svg>
                      Languages
                    </h4>
                    <div className="space-y-2">
                      {form.languages.map((lang, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input value={lang.language || ''} onChange={e => handleArrayChange('languages', i, 'language', e.target.value)}
                            placeholder="English"
                            className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white" />
                          <select value={lang.level || 'Intermediate'} onChange={e => handleArrayChange('languages', i, 'level', e.target.value)}
                            className="rounded-xl border border-slate-200 px-2 py-1.5 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white font-semibold">
                            {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map(l => <option key={l}>{l}</option>)}
                          </select>
                          {form.languages.length > 1 && (
                            <button type="button" onClick={() => removeItem('languages', i)} className="text-red-500 hover:text-red-700 text-lg font-bold px-1 transition-all active:scale-90">
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addItem('languages', emptyLang)}
                      className="w-full text-xs text-indigo-600 bg-white border border-indigo-200 rounded-xl py-2 mt-3 hover:bg-indigo-50 transition-all font-semibold flex items-center justify-center gap-1 shadow-sm">
                      + Add Language
                    </button>
                  </div>

                  {/* Hobbies */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4 text-indigo-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hobbies & Interests
                    </h4>
                    <input name="hobbies" value={form.hobbies} onChange={handleChange}
                      placeholder="Reading, Coding, Cricket, Photography"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white" />
                  </div>

                  {/* Wizard Footer */}
                  <div className="border-t border-slate-100 pt-4 flex justify-between">
                    <button type="button" onClick={() => setActiveTab('education')}
                      className="border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      Back
                    </button>
                    <span className="text-xs text-indigo-650 font-extrabold flex items-center gap-1.5 bg-indigo-50 px-3.5 py-2.5 rounded-xl shadow-sm border border-indigo-100">
                      ✨ Ready to Export!
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* CV Preview Section */}
        {layoutMode !== 'editor' && (
          <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center shadow-inner transition-all duration-300">
            <div id="cv-preview" className="w-full max-w-2xl shadow-2xl rounded-lg overflow-hidden border border-slate-200/50 bg-white self-start">
              {renderPreview()}
            </div>
          </div>
        )}

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