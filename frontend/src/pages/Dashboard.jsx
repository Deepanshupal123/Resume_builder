import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleSelectTemplate = (templateId) => {
    localStorage.setItem('selectedTemplate', templateId);
    navigate('/builder');
  };

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

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Apna resume kaise banana chahte ho?</h1>
          <p className="text-gray-500">Template choose karo ya AI se generate karo</p>
        </div>

        {/* ===== TOP CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl border-2 border-blue-100 p-8 hover:border-blue-400 transition cursor-pointer"
            onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })}>
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Template Builder</h2>
            <p className="text-gray-500 text-sm mb-4">20+ beautiful templates mein se choose karo, khud design karo aur PDF download karo</p>
            <span className="text-blue-600 text-sm font-medium">Template choose karo →</span>
          </div>

          <div className="bg-white rounded-2xl border-2 border-purple-100 p-8 hover:border-purple-400 transition cursor-pointer"
            onClick={() => navigate('/resume')}>
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Generated CV</h2>
            <p className="text-gray-500 text-sm mb-4">Details bharo — AI automatically professional resume likhega aur format karega</p>
            <span className="text-purple-600 text-sm font-medium">AI se generate karo →</span>
          </div>

          {/* ✅ NEW: Cover Letter Card */}
          <div className="bg-white rounded-2xl border-2 border-green-100 p-8 hover:border-green-400 transition cursor-pointer"
            onClick={() => navigate('/cover-letter')}>
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cover Letter</h2>
            <p className="text-gray-500 text-sm mb-4">AI se professional cover letter generate karo — job description paste karo, baaki AI karega</p>
            <span className="text-green-600 text-sm font-medium">Cover Letter banao →</span>
          </div>
        </div>

        {/* ===== TEMPLATES SECTION ===== */}
        <div id="templates">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Templates choose karo</h2>
          <p className="text-gray-500 text-sm mb-8">Koi bhi template select karo — form same rahega, sirf design badlega</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Classic */}
            <div onClick={() => handleSelectTemplate('classic')}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="h-64 bg-gray-50 p-4 overflow-hidden">
                <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', background: '#fff', padding: '20px 24px', fontFamily: 'serif', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase' }}>JOHN SMITH</div>
                    <div style={{ fontSize: '9px', color: '#555', marginTop: '4px' }}>john@email.com • +91 98765 43210 • linkedin.com/in/john</div>
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #000', marginBottom: '5px' }}>Professional Summary</div>
                  <div style={{ fontSize: '8px', color: '#333', lineHeight: '1.5', marginBottom: '10px' }}>Results-driven software developer with 3 years of experience building scalable web applications.</div>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #000', marginBottom: '5px' }}>Skills</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {['React', 'Node.js', 'Python', 'MongoDB'].map(s => <span key={s} style={{ border: '1px solid #000', padding: '1px 6px', fontSize: '7px' }}>{s}</span>)}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #000', marginBottom: '5px' }}>Work Experience</div>
                  <div style={{ fontSize: '8px', fontWeight: 'bold' }}>Software Developer</div>
                  <div style={{ fontSize: '7px', color: '#666', fontStyle: 'italic' }}>Tech Company • 2022 - Present</div>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #000', marginBottom: '5px', marginTop: '10px' }}>Education</div>
                  <div style={{ fontSize: '8px', fontWeight: 'bold' }}>B.Tech Computer Science</div>
                  <div style={{ fontSize: '7px', color: '#666', fontStyle: 'italic' }}>COER University • 2022</div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">Classic</h3>
                  <p className="text-xs text-gray-500">Simple & ATS-friendly</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">Use this</span>
              </div>
            </div>

            {/* Modern Blue */}
            <div onClick={() => handleSelectTemplate('modern')}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="h-64 bg-gray-50 p-4 overflow-hidden">
                <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', background: '#fff', fontFamily: 'Arial, sans-serif', display: 'flex', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minHeight: '200px' }}>
                  <div style={{ width: '90px', background: '#1d4ed8', color: '#fff', padding: '16px 12px', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '2px' }}>JOHN SMITH</div>
                    <div style={{ fontSize: '7px', opacity: 0.8, marginBottom: '10px' }}>Developer</div>
                    <div style={{ fontSize: '7px', marginBottom: '8px' }}>
                      <div>john@email.com</div>
                      <div>+91 98765 43210</div>
                    </div>
                    <div style={{ fontSize: '7px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '3px', marginBottom: '5px' }}>Skills</div>
                    {['React', 'Node.js', 'Python', 'MongoDB'].map(s => <div key={s} style={{ fontSize: '7px', background: 'rgba(255,255,255,0.15)', padding: '2px 5px', borderRadius: '2px', marginBottom: '3px' }}>{s}</div>)}
                  </div>
                  <div style={{ flex: 1, padding: '16px 14px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#1d4ed8', textTransform: 'uppercase', borderBottom: '2px solid #1d4ed8', paddingBottom: '2px', marginBottom: '5px' }}>Summary</div>
                    <div style={{ fontSize: '7px', lineHeight: '1.5', marginBottom: '10px', color: '#444' }}>Results-driven developer with 3 years of experience.</div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#1d4ed8', textTransform: 'uppercase', borderBottom: '2px solid #1d4ed8', paddingBottom: '2px', marginBottom: '5px' }}>Experience</div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold' }}>Software Developer</div>
                    <div style={{ fontSize: '7px', color: '#666', fontStyle: 'italic' }}>Tech Company • 2022 - Present</div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#1d4ed8', textTransform: 'uppercase', borderBottom: '2px solid #1d4ed8', paddingBottom: '2px', marginBottom: '5px', marginTop: '10px' }}>Education</div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold' }}>B.Tech CSE</div>
                    <div style={{ fontSize: '7px', color: '#666' }}>COER University • 2022</div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">Modern Blue</h3>
                  <p className="text-xs text-gray-500">Sidebar with blue accent</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">Use this</span>
              </div>
            </div>

            {/* Creative */}
            <div onClick={() => handleSelectTemplate('creative')}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="h-64 bg-gray-50 p-4 overflow-hidden">
                <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', background: '#fff', fontFamily: 'Georgia, serif', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: '#fff', padding: '16px 20px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>JOHN SMITH</div>
                    <div style={{ fontSize: '9px', opacity: 0.9 }}>Software Developer</div>
                    <div style={{ fontSize: '8px', marginTop: '4px', opacity: 0.8 }}>john@email.com • +91 98765 43210</div>
                  </div>
                  <div style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '4px' }}>About Me</div>
                    <div style={{ fontSize: '7px', color: '#444', lineHeight: '1.5', marginBottom: '8px' }}>Results-driven developer with 3 years of experience.</div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '4px' }}>Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '8px' }}>
                      {['React', 'Node.js', 'Python', 'MongoDB'].map(s => <span key={s} style={{ background: '#f3e8ff', color: '#7c3aed', padding: '1px 8px', borderRadius: '20px', fontSize: '7px' }}>{s}</span>)}
                    </div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '4px' }}>Experience</div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold' }}>Software Developer — Tech Company</div>
                    <div style={{ fontSize: '7px', color: '#666' }}>2022 - Present</div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">Creative</h3>
                  <p className="text-xs text-gray-500">Bold & colorful header</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">Use this</span>
              </div>
            </div>

            {/* Minimal */}
            <div onClick={() => handleSelectTemplate('minimal')}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="h-64 bg-gray-50 p-4 overflow-hidden">
                <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', background: '#fff', fontFamily: 'Helvetica, sans-serif', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '22px', fontWeight: '300', letterSpacing: '4px', textTransform: 'uppercase', color: '#111' }}>JOHN SMITH</div>
                  <div style={{ fontSize: '9px', color: '#059669', letterSpacing: '1px', marginBottom: '4px' }}>Software Developer</div>
                  <div style={{ fontSize: '8px', color: '#666', marginBottom: '12px' }}>john@email.com • +91 98765 43210</div>
                  <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '10px' }} />
                  <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#059669', marginBottom: '4px' }}>Profile</div>
                  <div style={{ fontSize: '7px', color: '#444', lineHeight: '1.6', marginBottom: '10px' }}>Results-driven developer with 3 years of experience.</div>
                  <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#059669', marginBottom: '4px' }}>Skills</div>
                  <div style={{ fontSize: '7px', color: '#444', marginBottom: '10px' }}>React • Node.js • Python • MongoDB</div>
                  <div style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#059669', marginBottom: '4px' }}>Experience</div>
                  <div style={{ fontSize: '8px', fontWeight: 'bold' }}>Software Developer</div>
                  <div style={{ fontSize: '7px', color: '#666' }}>Tech Company • 2022 - Present</div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">Minimal</h3>
                  <p className="text-xs text-gray-500">Clean & elegant</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">Use this</span>
              </div>
            </div>

            {/* Executive */}
            <div onClick={() => handleSelectTemplate('executive')}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="h-64 bg-gray-50 p-4 overflow-hidden">
                <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', background: '#fff', fontFamily: 'Georgia, serif', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ background: '#1e293b', color: '#fff', padding: '16px 22px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>JOHN SMITH</div>
                    <div style={{ fontSize: '9px', color: '#f59e0b', marginTop: '2px' }}>Software Developer</div>
                    <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '4px' }}>john@email.com • +91 98765 43210</div>
                  </div>
                  <div style={{ padding: '14px 22px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #f59e0b', paddingBottom: '3px', marginBottom: '5px' }}>Executive Summary</div>
                    <div style={{ fontSize: '7px', color: '#444', lineHeight: '1.5', marginBottom: '8px' }}>Results-driven developer with 3 years of experience.</div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #f59e0b', paddingBottom: '3px', marginBottom: '5px' }}>Core Competencies</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '8px' }}>
                      {['React', 'Node.js', 'Python', 'MongoDB'].map(s => <span key={s} style={{ background: '#1e293b', color: '#f59e0b', padding: '1px 6px', fontSize: '7px' }}>{s}</span>)}
                    </div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #f59e0b', paddingBottom: '3px', marginBottom: '5px' }}>Experience</div>
                    <div style={{ fontSize: '8px', fontWeight: 'bold' }}>Software Developer</div>
                    <div style={{ fontSize: '7px', color: '#666' }}>Tech Company • 2022 - Present</div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">Executive</h3>
                  <p className="text-xs text-gray-500">Premium dark header</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">Use this</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
