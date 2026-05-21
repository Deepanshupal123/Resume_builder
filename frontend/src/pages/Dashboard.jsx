import { useNavigate } from 'react-router-dom';

// ─── colour tokens ────────────────────────────────────────────────────────────
const C = {
  dark:    '#0F172A',
  dark2:   '#1E293B',
  dark3:   '#334155',
  accent:  '#6366F1',
  accent2: '#818CF8',
  light:   '#F8FAFC',
  card:    '#FFFFFF',
  txt1:    '#0F172A',
  txt2:    '#475569',
  txt3:    '#94A3B8',
  border:  '#E2E8F0',
  green:   '#10B981',
  amber:   '#F59E0B',
  pink:    '#EC4899',
  red:     '#EF4444',
};

// ─── tiny helpers ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color, style = {} }) => (
  <span
    className={`ti ti-${name}`}
    style={{ fontSize: size, color: color || 'inherit', lineHeight: 1, ...style }}
    aria-hidden="true"
  />
);

// ─── CV mini previews ─────────────────────────────────────────────────────────
const SecTitle = ({ children, accent = '#334155', borderColor = '#E2E8F0' }) => (
  <div style={{ fontSize: 7, fontWeight: 700, color: accent, borderBottom: `1px solid ${borderColor}`, paddingBottom: 1, margin: '4px 0 3px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
    {children}
  </div>
);
const CVRow = ({ l, r, bold, tc = '#1E293B' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6, color: '#475569', marginBottom: 1 }}>
    <span style={{ fontWeight: bold ? 600 : 400, color: tc }}>{l}</span>
    <span>{r}</span>
  </div>
);
const CVNote = ({ children }) => (
  <div style={{ fontSize: 6, color: '#64748B', marginBottom: 3 }}>{children}</div>
);
const Pills = ({ items, color = '#4338CA', bg = '#EEF2FF' }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2 }}>
    {items.map(i => (
      <span key={i} style={{ background: bg, color, padding: '1px 5px', borderRadius: 3, fontSize: 6, fontWeight: 600 }}>{i}</span>
    ))}
  </div>
);

/* Classic */
const CVClassic = () => (
  <div style={{ padding: 8, fontSize: 6.5, lineHeight: 1.4 }}>
    <div style={{ background: '#1E293B', color: '#fff', margin: '-8px -8px 6px', padding: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.03em' }}>JOHN SMITH</div>
      <div style={{ fontSize: 7, opacity: .8, marginTop: 1 }}>john@email.com • +91 98765 43210 • linkedin.com/in/john</div>
    </div>
    <SecTitle>Professional Summary</SecTitle>
    <CVNote>Results-driven software developer with 3 years of experience building scalable web apps.</CVNote>
    <SecTitle>Skills</SecTitle>
    <Pills items={['React', 'Node.js', 'Python', 'MongoDB']} />
    <SecTitle>Work Experience</SecTitle>
    <CVRow l="Software Developer" r="2022–Present" bold />
    <CVNote>Tech Company • Led development of 3 major products</CVNote>
    <SecTitle>Education</SecTitle>
    <CVRow l="B.Tech Computer Science" r="2022" bold />
    <CVNote>COER University</CVNote>
  </div>
);

/* Modern Blue */
const CVModern = () => (
  <div style={{ display: 'flex', fontSize: 6.5, lineHeight: 1.4, minHeight: 140 }}>
    <div style={{ width: 80, background: '#1d4ed8', color: '#fff', padding: '8px 7px', flexShrink: 0 }}>
      <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 1 }}>JOHN SMITH</div>
      <div style={{ fontSize: 6.5, opacity: .8, marginBottom: 6 }}>Developer</div>
      <div style={{ fontSize: 6, marginBottom: 6 }}><div>john@email.com</div><div>+91 98765 43210</div></div>
      <div style={{ fontSize: 6, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,.3)', paddingBottom: 2, marginBottom: 4 }}>Skills</div>
      {['React', 'Node.js', 'Python', 'MongoDB'].map(s => (
        <div key={s} style={{ fontSize: 6, background: 'rgba(255,255,255,.15)', padding: '1px 4px', borderRadius: 2, marginBottom: 2 }}>{s}</div>
      ))}
    </div>
    <div style={{ flex: 1, padding: '8px 10px' }}>
      <SecTitle accent="#1d4ed8">Summary</SecTitle>
      <CVNote>Results-driven developer with 3 years of experience.</CVNote>
      <SecTitle accent="#1d4ed8">Experience</SecTitle>
      <CVRow l="Software Developer" r="2022–" bold />
      <CVNote>Tech Company</CVNote>
      <SecTitle accent="#1d4ed8">Education</SecTitle>
      <CVRow l="B.Tech CSE" r="2022" bold />
      <CVNote>COER University</CVNote>
    </div>
  </div>
);

/* Creative */
const CVCreative = () => (
  <div style={{ fontSize: 6.5, lineHeight: 1.4 }}>
    <div style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', padding: '8px 10px', margin: '-0px' }}>
      <div style={{ fontSize: 10, fontWeight: 700 }}>JOHN SMITH</div>
      <div style={{ fontSize: 7, opacity: .9 }}>Software Developer</div>
      <div style={{ fontSize: 6.5, opacity: .8, marginTop: 2 }}>john@email.com • +91 98765 43210</div>
    </div>
    <div style={{ padding: '6px 8px' }}>
      <SecTitle accent="#7c3aed">About Me</SecTitle>
      <CVNote>Results-driven developer with 3 years of experience.</CVNote>
      <SecTitle accent="#7c3aed">Skills</SecTitle>
      <Pills items={['React', 'Node.js', 'Python', 'MongoDB']} color="#6D28D9" bg="#F5F3FF" />
      <SecTitle accent="#7c3aed">Experience</SecTitle>
      <CVRow l="Software Developer — Tech Company" r="2022–" bold />
    </div>
  </div>
);

/* Minimal */
const CVMinimal = () => (
  <div style={{ padding: 8, fontSize: 6.5, lineHeight: 1.4 }}>
    <div style={{ borderLeft: '3px solid #059669', paddingLeft: 6, marginBottom: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 300, letterSpacing: 3, textTransform: 'uppercase', color: '#111' }}>JOHN SMITH</div>
      <div style={{ fontSize: 7, color: '#059669', letterSpacing: 1 }}>Software Developer</div>
      <div style={{ fontSize: 6.5, color: '#64748B' }}>john@email.com • +91 98765 43210</div>
    </div>
    <SecTitle accent="#059669">Profile</SecTitle>
    <CVNote>Results-driven developer with 3 years of experience.</CVNote>
    <SecTitle accent="#059669">Skills</SecTitle>
    <CVNote>React • Node.js • Python • MongoDB</CVNote>
    <SecTitle accent="#059669">Experience</SecTitle>
    <CVRow l="Software Developer" r="2022–Present" bold />
    <CVNote>Tech Company</CVNote>
  </div>
);

/* Executive */
const CVExecutive = () => (
  <div style={{ fontSize: 6.5, lineHeight: 1.4 }}>
    <div style={{ background: '#1e293b', color: '#fff', padding: '8px 10px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>JOHN SMITH</div>
      <div style={{ fontSize: 7, color: '#f59e0b', marginTop: 1 }}>Software Developer</div>
      <div style={{ fontSize: 6.5, color: '#94a3b8', marginTop: 2 }}>john@email.com • +91 98765 43210</div>
    </div>
    <div style={{ padding: '6px 8px' }}>
      <SecTitle accent="#1e293b" borderColor="#f59e0b">Executive Summary</SecTitle>
      <CVNote>Results-driven developer with 3 years of experience.</CVNote>
      <SecTitle accent="#1e293b" borderColor="#f59e0b">Core Competencies</SecTitle>
      <Pills items={['React', 'Node.js', 'Python', 'MongoDB']} color="#f59e0b" bg="#1e293b" />
      <SecTitle accent="#1e293b" borderColor="#f59e0b">Experience</SecTitle>
      <CVRow l="Software Developer" r="2022–Present" bold tc="#1e293b" />
      <CVNote>Tech Company</CVNote>
    </div>
  </div>
);

// ─── template definitions ─────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 'classic',   name: 'Classic',      sub: 'Simple & ATS-friendly',   dot: '#1E293B', Preview: CVClassic   },
  { id: 'modern',    name: 'Modern Blue',  sub: 'Sidebar with blue accent', dot: '#1d4ed8', Preview: CVModern    },
  { id: 'creative',  name: 'Creative',     sub: 'Bold & colorful header',   dot: '#7c3aed', Preview: CVCreative  },
  { id: 'minimal',   name: 'Minimal',      sub: 'Clean & elegant',          dot: '#059669', Preview: CVMinimal   },
  { id: 'executive', name: 'Executive',    sub: 'Premium dark header',      dot: '#1e293b', Preview: CVExecutive },
];

// ─── top feature cards ────────────────────────────────────────────────────────
// Each card: { emoji, title, sub, cta, accent, onClick }

// ─── nav items ────────────────────────────────────────────────────────────────
const NAV_MAIN    = [
  { icon: 'layout-dashboard', label: 'Dashboard'        },
  { icon: 'file-text',        label: 'My CVs'           },
  { icon: 'template',         label: 'Templates'        },
  { icon: 'sparkles',         label: 'AI Writer'        },
];
const NAV_TOOLS   = [
  { icon: 'chart-bar',        label: 'Analytics'        },
  { icon: 'brand-linkedin',   label: 'LinkedIn Import'  },
  { icon: 'download',         label: 'Exports'          },
];
const NAV_ACCOUNT = [
  { icon: 'settings',         label: 'Settings'         },
  { icon: 'help',             label: 'Help'             },
];

// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleSelectTemplate = (templateId) => {
    localStorage.setItem('selectedTemplate', templateId);
    navigate('/builder');
  };

  // ── sidebar nav item ────────────────────────────────────────────────────────
  const NavItem = ({ icon, label, active }) => (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 20px',
        color: active ? C.accent2 : '#94A3B8',
        fontSize: 13,
        cursor: 'pointer',
        borderLeft: `3px solid ${active ? C.accent : 'transparent'}`,
        background: active ? C.dark2 : 'transparent',
        transition: 'all .15s',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.dark2; e.currentTarget.style.color = '#fff'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
    >
      <Icon name={icon} size={17} />{label}
    </div>
  );

  const NavSection = ({ label }) => (
    <div style={{ padding: '10px 20px 4px', color: '#475569', fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</div>
  );

  // ── feature card ────────────────────────────────────────────────────────────
  const FeatureCard = ({ emoji, title, sub, cta, accent, onClick }) => (
    <div
      onClick={onClick}
      style={{
        background: C.card, borderRadius: 18,
        border: `2px solid ${accent}22`,
        padding: '28px 24px', cursor: 'pointer',
        transition: 'all .2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}22`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${accent}22`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ fontSize: 36, marginBottom: 14 }}>{emoji}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.txt1, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: C.txt2, marginBottom: 16, lineHeight: 1.6 }}>{sub}</div>
      <div style={{ fontSize: 13, color: accent, fontWeight: 500 }}>{cta} →</div>
    </div>
  );

  // ── template card ───────────────────────────────────────────────────────────
  const TemplateCard = ({ id, name, sub, dot, Preview }) => (
    <div
      onClick={() => handleSelectTemplate(id)}
      style={{
        background: C.card, borderRadius: 18,
        border: `1px solid ${C.border}`,
        overflow: 'hidden', cursor: 'pointer',
        transition: 'all .2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = C.accent; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = C.border; }}
    >
      {/* preview */}
      <div style={{ height: 200, background: '#F8FAFC', padding: 12, overflow: 'hidden', position: 'relative' }}>
        <div style={{ transform: 'scale(0.58)', transformOrigin: 'top left', width: '172%', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,.08)', borderRadius: 4 }}>
          <Preview />
        </div>
        {/* fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, #F8FAFC)' }} />
      </div>
      {/* footer */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.txt1 }}>{name}</div>
          <div style={{ fontSize: 11, color: C.txt2, marginTop: 1 }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
          <span style={{
            fontSize: 11, background: '#F1F5F9', color: C.txt2,
            padding: '4px 12px', borderRadius: 20, fontWeight: 500,
            transition: 'all .15s',
          }}>Use this</span>
        </div>
      </div>
    </div>
  );

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Tabler icons CDN */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: C.light }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: 220, background: C.dark, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
          {/* logo */}
          <div style={{ padding: '20px 20px 22px', borderBottom: `1px solid ${C.dark3}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>R</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>ResumeAI</div>
                <div style={{ color: C.txt3, fontSize: 11 }}>CV Builder Pro</div>
              </div>
            </div>
          </div>

          {/* nav */}
          <nav style={{ flex: 1, paddingTop: 10 }}>
            <NavSection label="Main" />
            {NAV_MAIN.map(n    => <NavItem key={n.label} {...n} active={n.label === 'Dashboard'} />)}
            <NavSection label="Tools" />
            {NAV_TOOLS.map(n   => <NavItem key={n.label} {...n} />)}
            <NavSection label="Account" />
            {NAV_ACCOUNT.map(n => <NavItem key={n.label} {...n} />)}
          </nav>

          {/* user + logout */}
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.dark3}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                {(user.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{user.name || 'User'}</div>
                <div style={{ color: C.txt3, fontSize: 10 }}>Pro Plan</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{ width: '100%', background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, color: '#FCA5A5', fontSize: 12, fontWeight: 500, padding: '7px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.22)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,.12)'; }}
            >
              <Icon name="logout" size={14} color="#FCA5A5" /> Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* topbar */}
          <header style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, padding: '0 32px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.txt1 }}>Dashboard</div>
              <div style={{ fontSize: 12, color: C.txt2 }}>Hi, {user.name || 'User'} 👋 — What would you like to build today?</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: C.accent, border: 'none', color: '#fff' }}
                onClick={() => document.getElementById('templates-section').scrollIntoView({ behavior: 'smooth' })}
              >
                <Icon name="plus" size={15} color="#fff" /> New CV
              </button>
              <div style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', color: C.txt2 }}>
                <Icon name="bell" size={18} />
                <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: C.red, borderRadius: '50%', border: '2px solid #fff' }} />
              </div>
            </div>
          </header>

          {/* content */}
          <main style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 28px' }}>

            {/* section heading */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: C.txt1, margin: '0 0 8px' }}>How would you like to build your resume?</h1>
              <p style={{ fontSize: 14, color: C.txt2, margin: 0 }}>Choose a template or generate with AI</p>
            </div>

            {/* ── TOP 3 CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 20 }}>
              <FeatureCard
                emoji="🎨" title="Template Builder"
                sub="Choose from beautiful templates, customize, and download PDF"
                cta="Choose template" accent="#6366F1"
                onClick={() => document.getElementById('templates-section').scrollIntoView({ behavior: 'smooth' })}
              />
              <FeatureCard
                emoji="🤖" title="AI Generated CV"
                sub="Fill details — AI will automatically generate and format a professional resume"
                cta="Generate with AI" accent="#8B5CF6"
                onClick={() => navigate('/resume')}
              />
              <FeatureCard
                emoji="📝" title="Cover Letter"
                sub="Generate a professional cover letter with AI — paste the job description and AI will do the rest"
                cta="Create Cover Letter" accent="#10B981"
                onClick={() => navigate('/cover-letter')}
              />
            </div>

            {/* ── ATS + JD ROW ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 44 }}>
              <FeatureCard
                emoji="🎯" title="ATS Score Checker"
                sub="Paste resume + job description → AI will show match percentage, missing keywords, and improvements"
                cta="Check Score" accent="#F59E0B"
                onClick={() => navigate('/ats-checker')}
              />
              <FeatureCard
                emoji="🔍" title="JD Match Analyzer"
                sub="Match your resume to a job description — get skill gaps, missing keywords, and tailoring tips"
                cta="Analyze Match" accent="#EC4899"
                onClick={() => navigate('/jd-match')}
              />
            </div>

            {/* ── TEMPLATES ── */}
            <div id="templates-section">
              {/* dark heading card */}
              <div style={{ background: C.dark, borderRadius: 16, padding: '24px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Choose a template</div>
                  <div style={{ fontSize: 13, color: C.txt3 }}>Select any template — the form stays the same, only the design changes</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[C.accent, '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                {TEMPLATES.map(t => <TemplateCard key={t.id} {...t} />)}
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}
