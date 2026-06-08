import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showScore, setShowScore] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleSelectTemplate = (templateId) => {
    localStorage.setItem('selectedTemplate', templateId);
    navigate('/builder');
  };

  const initials = (name) =>
    (name || 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  /* ── CV Preview components ── */
  const ClassicCV = () => (
    <div style={{ fontFamily: 'Georgia,serif', fontSize: 8, lineHeight: 1.45, background: '#fff', padding: '14px 13px', minHeight: 380 }}>
      <div style={{ textAlign: 'center', borderBottom: '1.5px solid #111', paddingBottom: 6, marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#111' }}>ARYAN SHARMA</div>
        <div style={{ fontSize: 6.5, color: '#444', marginTop: 2 }}>aryan@gmail.com • +91 98765 43210 • Dehradun, UK</div>
      </div>
      <SectionHead title="Professional Summary" color="#111" borderColor="#111" />
      <div style={{ fontSize: 6.5, color: '#333', marginBottom: 8 }}>Results-driven Full Stack Developer with 3+ years building scalable web applications. Passionate about clean code and high-performance products.</div>
      <SectionHead title="Work Experience" color="#111" borderColor="#111" />
      <ExpRow title="Software Developer" company="TechNova Solutions, Noida" date="2022–Present" color="#555" bullets={['Built RESTful APIs serving 50k+ daily users', 'React dashboards, 40% faster load time', 'AWS CI/CD pipeline integration']} />
      <ExpRow title="Frontend Intern" company="WebCraft India, Remote" date="2021" color="#555" bullets={['Pixel-perfect React components from Figma']} />
      <SectionHead title="Skills" color="#111" borderColor="#111" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
        {['React.js', 'Node.js', 'MongoDB', 'Python', 'AWS', 'Docker'].map(s => <span key={s} style={{ border: '.7px solid #111', padding: '1px 5px', fontSize: 6, color: '#111' }}>{s}</span>)}
      </div>
      <SectionHead title="Education" color="#111" borderColor="#111" />
      <div style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>B.Tech – Computer Science</div>
      <div style={{ fontSize: 6.5, color: '#555' }}>COER University, Roorkee • 2018–2022 • CGPA 8.4</div>
    </div>
  );

  const ModernBlueCV = () => (
    <div style={{ display: 'flex', minHeight: 380, background: '#fff', fontFamily: 'Arial,sans-serif', fontSize: 8 }}>
      <div style={{ width: 82, background: '#1a73e8', color: '#fff', padding: '12px 8px', flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, margin: '0 auto 7px' }}>AS</div>
        <div style={{ fontSize: 7.5, fontWeight: 700, textAlign: 'center', lineHeight: 1.3, marginBottom: 7 }}>ARYAN SHARMA</div>
        <div style={{ fontSize: 5.5, opacity: .85, marginBottom: 1 }}>aryan@gmail.com</div>
        <div style={{ fontSize: 5.5, opacity: .85, marginBottom: 1 }}>+91 98765 43210</div>
        <div style={{ fontSize: 5.5, opacity: .75, marginBottom: 8 }}>Dehradun, UK</div>
        <div style={{ fontSize: 6, fontWeight: 700, textTransform: 'uppercase', borderBottom: '.5px solid rgba(255,255,255,.3)', paddingBottom: 2, marginBottom: 4 }}>Skills</div>
        {['React.js', 'Node.js', 'MongoDB', 'Python', 'AWS', 'Docker'].map(s => <div key={s} style={{ background: 'rgba(255,255,255,.15)', padding: '1px 3px', borderRadius: 2, fontSize: 5.5, marginBottom: 2 }}>{s}</div>)}
        <div style={{ fontSize: 6, fontWeight: 700, textTransform: 'uppercase', borderBottom: '.5px solid rgba(255,255,255,.3)', paddingBottom: 2, margin: '8px 0 4px' }}>Education</div>
        <div style={{ fontSize: 6, fontWeight: 700 }}>B.Tech CSE</div>
        <div style={{ fontSize: 5.5, opacity: .75 }}>COER Univ. 2022</div>
      </div>
      <div style={{ flex: 1, padding: '12px 10px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1a73e8', marginBottom: 1 }}>Full Stack Developer</div>
        <div style={{ fontSize: 6, color: '#666', marginBottom: 7 }}>3+ years experience</div>
        <BlueSection title="Experience" />
        <ExpRow title="Software Developer" company="TechNova Solutions" date="2022–Present" color="#1a73e8" bullets={['APIs for 50k+ daily users', '40% faster React dashboards', 'AWS CI/CD pipelines']} />
        <ExpRow title="Frontend Intern" company="WebCraft India" date="2021" color="#1a73e8" bullets={['Pixel-perfect React components']} />
      </div>
    </div>
  );

  const CreativeCV = () => (
    <div style={{ background: '#fff', fontFamily: 'Georgia,serif', fontSize: 8, minHeight: 380 }}>
      <div style={{ background: '#7c3aed', color: '#fff', padding: '14px 13px' }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Aryan Sharma</div>
        <div style={{ fontSize: 7.5, opacity: .9, marginTop: 2 }}>Full Stack Developer</div>
        <div style={{ fontSize: 6, opacity: .75, marginTop: 4 }}>aryan@gmail.com • +91 98765 43210 • Dehradun</div>
      </div>
      <div style={{ padding: '11px 13px' }}>
        <PurpleLabel title="About Me" /><div style={{ fontSize: 6.5, color: '#444', lineHeight: 1.55, marginBottom: 7 }}>Full Stack Developer with 3+ years experience. Passionate about clean code.</div>
        <PurpleLabel title="Skills" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 7 }}>
          {['React.js', 'Node.js', 'MongoDB', 'Python', 'AWS'].map(s => <span key={s} style={{ background: '#f3e8ff', color: '#7c3aed', padding: '1px 6px', borderRadius: 10, fontSize: 6 }}>{s}</span>)}
        </div>
        <PurpleLabel title="Experience" />
        <ExpRow title="Software Developer" company="TechNova Solutions" date="2022–Present" color="#7c3aed" bullets={['APIs for 50k+ users', '40% faster React dashboards']} />
        <PurpleLabel title="Education" />
        <div style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>B.Tech – CSE</div>
        <div style={{ fontSize: 6.5, color: '#666' }}>COER University • 2018–2022</div>
      </div>
    </div>
  );

  const MinimalCV = () => (
    <div style={{ background: '#fff', fontFamily: 'Helvetica,sans-serif', padding: '14px 13px', fontSize: 8, minHeight: 380 }}>
      <div style={{ fontSize: 16, fontWeight: 300, letterSpacing: '3px', textTransform: 'uppercase', color: '#111' }}>ARYAN SHARMA</div>
      <div style={{ fontSize: 7.5, color: '#059669', letterSpacing: '1px', marginTop: 2 }}>Full Stack Developer</div>
      <div style={{ fontSize: 6.5, color: '#666', marginTop: 3, marginBottom: 8 }}>aryan@gmail.com • +91 98765 43210 • Dehradun</div>
      <div style={{ height: .5, background: '#e5e7eb', marginBottom: 7 }} />
      <GreenLabel title="Experience" />
      <ExpRow title="Software Developer" company="TechNova Solutions, Noida" date="2022–Present" color="#059669" bullets={['APIs for 50k+ daily users', '40% faster React dashboards', 'AWS CI/CD pipelines']} />
      <div style={{ height: .5, background: '#e5e7eb', margin: '7px 0' }} />
      <GreenLabel title="Skills" />
      <div style={{ fontSize: 6.5, color: '#444', marginBottom: 7 }}>React.js • Node.js • MongoDB • Python • AWS • Docker</div>
      <div style={{ height: .5, background: '#e5e7eb', margin: '7px 0' }} />
      <GreenLabel title="Education" />
      <div style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>B.Tech – Computer Science</div>
      <div style={{ fontSize: 6.5, color: '#666' }}>COER University, Roorkee • 2018–2022 • CGPA 8.4</div>
    </div>
  );

  const ExecutiveCV = () => (
    <div style={{ background: '#fff', fontFamily: 'Georgia,serif', fontSize: 8, minHeight: 380 }}>
      <div style={{ background: '#1e293b', color: '#fff', padding: '14px 13px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>ARYAN SHARMA</div>
        <div style={{ fontSize: 7.5, color: '#f59e0b', marginTop: 3 }}>Full Stack Developer</div>
        <div style={{ fontSize: 6, color: '#94a3b8', marginTop: 4 }}>aryan@gmail.com • +91 98765 43210 • Dehradun</div>
      </div>
      <div style={{ padding: '11px 13px' }}>
        <GoldSection title="Executive Summary" />
        <div style={{ fontSize: 6.5, color: '#444', lineHeight: 1.55, marginBottom: 7 }}>Results-driven Full Stack Developer with 3+ years delivering scalable web solutions. Expert in React, Node.js, and AWS.</div>
        <GoldSection title="Core Competencies" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 7 }}>
          {['React.js', 'Node.js', 'MongoDB', 'Python', 'AWS', 'Docker'].map(s => <span key={s} style={{ background: '#1e293b', color: '#f59e0b', padding: '1px 5px', fontSize: 6 }}>{s}</span>)}
        </div>
        <GoldSection title="Professional Experience" />
        <ExpRow title="Software Developer" company="TechNova Solutions, Noida" date="2022–Present" color="#b45309" bullets={['Built APIs for 50k+ daily users', 'React dashboards 40% faster', 'AWS CI/CD pipelines']} />
        <GoldSection title="Education" />
        <div style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>B.Tech – Computer Science</div>
        <div style={{ fontSize: 6.5, color: '#666' }}>COER University • 2018–2022 • CGPA 8.4</div>
      </div>
    </div>
  );

  /* ── helper sub-components ── */
  const SectionHead = ({ title, color, borderColor }) => (
    <div style={{ fontSize: 6.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', borderBottom: `1px solid ${borderColor}`, marginBottom: 4, color, paddingBottom: 1 }}>{title}</div>
  );
  const BlueSection = ({ title }) => (
    <div style={{ fontSize: 6.5, fontWeight: 700, color: '#1a73e8', textTransform: 'uppercase', borderBottom: '1.5px solid #1a73e8', paddingBottom: 1, marginBottom: 4 }}>{title}</div>
  );
  const PurpleLabel = ({ title }) => (
    <div style={{ fontSize: 6.5, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 3 }}>{title}</div>
  );
  const GreenLabel = ({ title }) => (
    <div style={{ fontSize: 6.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#059669', marginBottom: 3 }}>{title}</div>
  );
  const GoldSection = ({ title }) => (
    <div style={{ fontSize: 6.5, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '.8px', borderBottom: '1.5px solid #f59e0b', paddingBottom: 2, marginBottom: 5 }}>{title}</div>
  );
  const ExpRow = ({ title, company, date, color, bullets }) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>{title}</span>
        <span style={{ fontSize: 6, color: '#888' }}>{date}</span>
      </div>
      <div style={{ fontSize: 6.5, color, marginBottom: 2 }}>{company}</div>
      {bullets.map((b, i) => <div key={i} style={{ fontSize: 6, color: '#444' }}>• {b}</div>)}
    </div>
  );

  const templates = [
    { id: 'classic', name: 'Classic', sub: 'ATS-friendly', Preview: ClassicCV },
    { id: 'modern', name: 'Modern Blue', sub: 'Sidebar accent', Preview: ModernBlueCV },
    { id: 'creative', name: 'Creative', sub: 'Bold & colorful', Preview: CreativeCV },
    { id: 'minimal', name: 'Minimal', sub: 'Clean & elegant', Preview: MinimalCV },
    { id: 'executive', name: 'Executive', sub: 'Premium dark', Preview: ExecutiveCV },
  ];

  const stats = [
    { icon: 'folder_open', label: 'Total Resumes', value: '12', badge: '+2 this week', badgeColor: '#2ECC71', iconBg: 'rgba(160,202,255,.12)', iconColor: '#a0caff' },
    { icon: 'leaderboard', label: 'Avg. ATS Score', value: '88', suffix: '/100', badge: 'Top 5%', badgeColor: '#a0caff', iconBg: 'rgba(210,187,255,.12)', iconColor: '#d2bbff' },
    { icon: 'download', label: 'Downloads', value: '34', badge: '428 total', badgeColor: '#8a919e', iconBg: 'rgba(76,215,246,.12)', iconColor: '#4cd7f6' },
    { icon: 'bolt', label: 'Profile Strength', value: '78', suffix: '%', badge: '', badgeColor: '', iconBg: 'rgba(46,204,113,.12)', iconColor: '#2ECC71', progress: 78 },
  ];

  const buildTools = [
    { icon: 'design_services', iconBg: 'rgba(160,202,255,.12)', iconColor: '#a0caff', title: 'Template Builder', desc: 'Customize 50+ designer templates with our drag-and-drop editor.', linkColor: '#a0caff', linkText: 'Choose template', gradient: true, onClick: () => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' }) },
    { icon: 'auto_fix_high', iconBg: 'rgba(210,187,255,.12)', iconColor: '#d2bbff', title: 'AI Resume Generator', desc: 'Let AI write your experience and skills based on your dream role.', linkColor: '#d2bbff', linkText: 'Generate with AI', gradient: true, onClick: () => navigate('/resume') },
    { icon: 'mail', iconBg: 'rgba(46,204,113,.12)', iconColor: '#2ECC71', title: 'Cover Letter Gen', desc: 'Generate personalized cover letters that match your resume tone.', linkColor: '#2ECC71', linkText: 'Create letter', gradient: true, onClick: () => navigate('/cover-letter') },
    { icon: 'shield', iconBg: 'rgba(160,202,255,.12)', iconColor: '#a0caff', title: 'ATS Score Checker', desc: 'Instantly scan for readability, formatting and keyword match.', linkColor: '#a0caff', linkText: 'Check score', gradient: false, onClick: () => navigate('/ats-checker') },
    { icon: 'analytics', iconBg: 'rgba(210,187,255,.12)', iconColor: '#d2bbff', title: 'JD Match Analyzer', desc: 'Compare your resume against any job posting for gaps.', linkColor: '#d2bbff', linkText: 'Analyze match', gradient: false, onClick: () => navigate('/jd-match') },
    { icon: 'verified', iconBg: 'rgba(76,215,246,.12)', iconColor: '#4cd7f6', title: 'Resume Score Card', desc: 'Get deep AI feedback on content quality and impact.', linkColor: '#4cd7f6', linkText: 'Get score', gradient: false, onClick: () => navigate('/score') },
  ];

  const recentResumes = [
    { title: 'Senior Product Designer – Apple', date: 'Oct 24, 2023', template: 'Minimalist Pro', score: 92, color: '#2ECC71', label: 'Excellent' },
    { title: 'Full Stack Engineer – Stripe', date: 'Oct 21, 2023', template: 'Modern Tech', score: 84, color: '#a0caff', label: 'Very Good' },
    { title: 'UI/UX Designer – Figma', date: 'Oct 18, 2023', template: 'Creative', score: 78, color: '#d2bbff', label: 'Good' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111318', fontFamily: "'Inter', sans-serif", color: '#e2e2e8' }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 280, background: '#0c0e13', borderRight: '1px solid #404752', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }}>
        <div style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>R</div>
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 18, fontWeight: 700, color: '#a0caff' }}>ResumeAI</span>
        </div>

        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { icon: 'dashboard', label: 'Dashboard', active: true, path: '/dashboard' },
            { icon: 'description', label: 'My Resumes', active: false, path: '/resumes' },
            { icon: 'style', label: 'Templates', active: false, path: '/templates' },
            { icon: 'psychology', label: 'AI Analysis', active: false, path: '/analysis' },
            { icon: 'settings', label: 'Settings', active: false, path: '/settings' },
          ].map((item) => (
            <div key={item.label}
              onClick={() => item.path && navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                background: item.active ? 'rgba(160,202,255,.1)' : 'transparent',
                borderLeft: item.active ? '3px solid #a0caff' : '3px solid transparent',
                color: item.active ? '#a0caff' : '#8a919e',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* User card */}
        <div style={{ padding: 16, margin: '0 12px 16px', background: 'rgba(160,202,255,.06)', borderRadius: 16, border: '1px solid rgba(160,202,255,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(160,202,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0caff', fontWeight: 700, fontSize: 13 }}>{initials(user.name)}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e2e8' }}>{user.name || 'User'}</div>
              <div style={{ fontSize: 11, color: '#8a919e' }}>Pro Plan</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '8px 0', background: 'rgba(255,180,171,.08)', border: '1px solid rgba(255,180,171,.15)', borderRadius: 10, color: '#ffb4ab', fontSize: 12, fontFamily: 'Geist, sans-serif', fontWeight: 500, cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ marginLeft: 280, flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* TopBar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(17,19,24,.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #404752', padding: '12px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', maxWidth: 380, flex: 1 }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8a919e', fontSize: 18 }}>search</span>
            <input placeholder="Search templates, resumes..." style={{ width: '100%', paddingLeft: 38, paddingRight: 16, paddingTop: 8, paddingBottom: 8, background: '#1d2024', border: '1px solid #404752', borderRadius: 10, color: '#e2e2e8', fontSize: 13, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ background: 'none', border: 'none', color: '#8a919e', cursor: 'pointer' }}><span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span></button>
            <div style={{ height: 24, width: 1, background: '#404752' }} />
            <button style={{ padding: '8px 20px', border: '2px solid #a0caff', borderRadius: 10, background: 'none', color: '#a0caff', fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Upgrade</button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>{initials(user.name)}</div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* ── Hero ── */}
          <section style={{ background: 'linear-gradient(135deg, rgba(79,70,229,.12) 0%, rgba(6,182,212,.08) 100%)', borderRadius: 28, padding: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', border: '1px solid rgba(79,70,229,.15)', position: 'relative', overflow: 'hidden' }}>
            <div>
              <h1 style={{ fontFamily: 'Geist, sans-serif', fontSize: 40, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.02em', color: '#e2e2e8', marginBottom: 14 }}>
                Build Your Professional{' '}
                <span style={{ background: 'linear-gradient(90deg,#4F46E5,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Resume with AI</span>
              </h1>
              <p style={{ fontSize: 16, color: '#8a919e', lineHeight: 1.6, marginBottom: 28, maxWidth: 440 }}>Harness GPT-4 to craft high-impact resumes that pass ATS filters and land you 3x more interviews.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })} style={{ padding: '14px 28px', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', border: 'none', borderRadius: 14, color: '#fff', fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>Create Resume
                </button>
                <button onClick={() => navigate('/resume')} style={{ padding: '14px 28px', background: 'rgba(255,255,255,.06)', border: '1px solid #404752', borderRadius: 14, color: '#e2e2e8', fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_awesome</span>Generate with AI
                </button>
              </div>
            </div>
            {/* Glass preview card */}
            <div style={{ background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 24, padding: 24, transform: 'rotate(3deg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,180,171,.4)' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(210,187,255,.4)' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(46,204,113,.4)' }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#a0caff', padding: '3px 10px', background: 'rgba(160,202,255,.1)', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.06em' }}>Live Preview</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ height: 14, width: '70%', background: 'rgba(255,255,255,.08)', borderRadius: 6 }} />
                <div style={{ height: 10, width: '100%', background: 'rgba(255,255,255,.05)', borderRadius: 6 }} />
                <div style={{ height: 10, width: '85%', background: 'rgba(255,255,255,.05)', borderRadius: 6 }} />
                <div style={{ height: 90, background: 'rgba(255,255,255,.04)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(160,202,255,.2)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'rgba(160,202,255,.3)' }}>description</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Stats ── */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(20px)', border: '1px solid #404752', borderRadius: 24, padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: s.iconColor }}>{s.icon}</span>
                  </div>
                  {s.badge && <span style={{ fontSize: 11, fontWeight: 700, color: s.badgeColor }}>{s.badge}</span>}
                  {s.progress !== undefined && (
                    <div style={{ flex: 1, marginLeft: 10, height: 4, background: '#33353a', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.progress}%`, background: '#2ECC71', borderRadius: 4 }} />
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: '#8a919e', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 30, fontWeight: 700, color: '#e2e2e8' }}>
                  {s.value}<span style={{ fontSize: 16, color: '#8a919e' }}>{s.suffix}</span>
                </div>
              </div>
            ))}
          </section>

          {/* ── AI Toolbox ── */}
          <section>
            <h2 style={{ fontFamily: 'Geist, sans-serif', fontSize: 22, fontWeight: 600, color: '#e2e2e8', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="material-symbols-outlined" style={{ color: '#a0caff' }}>apps</span>Smart AI Toolbox
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {buildTools.map((t) => (
                <div key={t.title} onClick={t.onClick}
                  style={{ background: t.gradient ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.03)', border: t.gradient ? '2px solid transparent' : '1px solid #404752', borderRadius: 24, padding: 24, cursor: 'pointer', position: 'relative', backgroundClip: 'padding-box', transition: 'transform .15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  {t.gradient && <div style={{ position: 'absolute', inset: -1, borderRadius: 24, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', zIndex: -1 }} />}
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: t.iconColor }}>{t.icon}</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e2e2e8', marginBottom: 6, fontFamily: 'Geist, sans-serif' }}>{t.title}</h3>
                  <p style={{ fontSize: 13, color: '#8a919e', lineHeight: 1.55, marginBottom: 14 }}>{t.desc}</p>
                  <div style={{ fontSize: 12, fontWeight: 500, color: t.linkColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {t.linkText} <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Recent Resumes ── */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Geist, sans-serif', fontSize: 22, fontWeight: 600, color: '#e2e2e8' }}>Recent Resumes</h2>
              <button style={{ background: 'none', border: 'none', color: '#a0caff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                View All <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
            </div>
            <div style={{ background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(20px)', border: '1px solid #404752', borderRadius: 24, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid #404752' }}>
                    {['Title', 'Date Modified', 'Template', 'Score', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: '#8a919e' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentResumes.map((r, i) => (
                    <tr key={i} style={{ borderBottom: i < recentResumes.length - 1 ? '1px solid rgba(64,71,82,.4)' : 'none' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 36, background: 'rgba(160,202,255,.06)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'rgba(160,202,255,.4)' }}>article</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e2e8' }}>{r.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: '#8a919e' }}>{r.date}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,.06)', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#8a919e' }}>{r.template}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${r.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: r.color }}>{r.score}</div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#8a919e' }}>{r.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button style={{ padding: '6px 14px', background: 'rgba(160,202,255,.1)', border: 'none', borderRadius: 10, color: '#a0caff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Geist, sans-serif' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Templates ── */}
          <section id="templates" style={{ paddingBottom: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: 'Geist, sans-serif', fontSize: 22, fontWeight: 600, color: '#e2e2e8', marginBottom: 4 }}>Top Performing Templates</h2>
                <p style={{ fontSize: 13, color: '#8a919e' }}>Same form, different design — pick what suits you</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['chevron_left', 'chevron_right'].map(ic => (
                  <button key={ic} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #404752', background: 'none', color: '#8a919e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{ic}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {templates.map(({ id, name, sub, Preview }) => (
                <div key={id} onClick={() => handleSelectTemplate(id)}
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid #404752', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s, transform .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#a0caff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#404752'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {/* CV preview */}
                  <div style={{ height: 210, overflow: 'hidden', position: 'relative' }}>
                    <Preview />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, rgba(17,19,24,.98))', pointerEvents: 'none' }} />
                    {/* hover overlay */}
                    <div className="tmpl-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(17,19,24,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                      <button style={{ padding: '10px 24px', background: '#fff', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#111318', border: 'none', cursor: 'pointer' }}>Use Template</button>
                    </div>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #404752' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e2e8', fontFamily: 'Geist, sans-serif' }}>{name}</div>
                      <div style={{ fontSize: 11, color: '#8a919e', marginTop: 2 }}>{sub}</div>
                    </div>
                    <span style={{ fontSize: 10, background: 'rgba(160,202,255,.1)', color: '#a0caff', padding: '4px 10px', borderRadius: 20, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>ATS Friendly</span>
                  </div>
                </div>
              ))}

              {/* Placeholder */}
              <div style={{ background: 'rgba(255,255,255,.03)', border: '2px dashed #404752', borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, gap: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#404752' }}>add</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#8a919e' }}>More coming soon</span>
                <span style={{ fontSize: 11, color: '#404752' }}>New templates</span>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ── Floating Score Widget ── */}
      {showScore && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 60, background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 24, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 32px rgba(0,0,0,.4)' }}>
          <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
            <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r="22" fill="transparent" stroke="#33353a" strokeWidth="4" />
              <circle cx="26" cy="26" r="22" fill="transparent" stroke="#2ECC71" strokeWidth="4" strokeDasharray="138" strokeDashoffset="25" />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#e2e2e8' }}>82</span>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: '#8a919e', marginBottom: 2 }}>Resume Score</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2ECC71', marginBottom: 5 }}>Good Strength</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ width: 28, height: 3, background: '#2ECC71', borderRadius: 4 }} />
              <div style={{ width: 28, height: 3, background: '#2ECC71', borderRadius: 4 }} />
              <div style={{ width: 28, height: 3, background: '#33353a', borderRadius: 4 }} />
            </div>
          </div>
          <button onClick={() => setShowScore(false)} style={{ background: 'none', border: 'none', color: '#8a919e', cursor: 'pointer', padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>
      )}
    </div>
  );
}
