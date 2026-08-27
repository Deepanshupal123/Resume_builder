/* Miniature CV previews used on Dashboard and Templates pages */

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

const SectionHead = ({ title, color, borderColor }) => (
  <div style={{ fontSize: 6.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', borderBottom: `1px solid ${borderColor}`, marginBottom: 4, color, paddingBottom: 1 }}>{title}</div>
);

export const ClassicCV = () => (
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

export const ModernBlueCV = () => (
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
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#1a73e8', textTransform: 'uppercase', borderBottom: '1.5px solid #1a73e8', paddingBottom: 1, marginBottom: 4 }}>Experience</div>
      <ExpRow title="Software Developer" company="TechNova Solutions" date="2022–Present" color="#1a73e8" bullets={['APIs for 50k+ daily users', '40% faster React dashboards', 'AWS CI/CD pipelines']} />
      <ExpRow title="Frontend Intern" company="WebCraft India" date="2021" color="#1a73e8" bullets={['Pixel-perfect React components']} />
    </div>
  </div>
);

export const CreativeCV = () => (
  <div style={{ background: '#fff', fontFamily: 'Georgia,serif', fontSize: 8, minHeight: 380 }}>
    <div style={{ background: '#7c3aed', color: '#fff', padding: '14px 13px' }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>Aryan Sharma</div>
      <div style={{ fontSize: 7.5, opacity: .9, marginTop: 2 }}>Full Stack Developer</div>
      <div style={{ fontSize: 6, opacity: .75, marginTop: 4 }}>aryan@gmail.com • +91 98765 43210 • Dehradun</div>
    </div>
    <div style={{ padding: '11px 13px' }}>
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 3 }}>About Me</div>
      <div style={{ fontSize: 6.5, color: '#444', lineHeight: 1.55, marginBottom: 7 }}>Full Stack Developer with 3+ years experience. Passionate about clean code.</div>
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 3 }}>Skills</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 7 }}>
        {['React.js', 'Node.js', 'MongoDB', 'Python', 'AWS'].map(s => <span key={s} style={{ background: '#f3e8ff', color: '#7c3aed', padding: '1px 6px', borderRadius: 10, fontSize: 6 }}>{s}</span>)}
      </div>
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 3 }}>Experience</div>
      <ExpRow title="Software Developer" company="TechNova Solutions" date="2022–Present" color="#7c3aed" bullets={['APIs for 50k+ users', '40% faster React dashboards']} />
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 3 }}>Education</div>
      <div style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>B.Tech – CSE</div>
      <div style={{ fontSize: 6.5, color: '#666' }}>COER University • 2018–2022</div>
    </div>
  </div>
);

export const MinimalCV = () => (
  <div style={{ background: '#fff', fontFamily: 'Helvetica,sans-serif', padding: '14px 13px', fontSize: 8, minHeight: 380 }}>
    <div style={{ fontSize: 16, fontWeight: 300, letterSpacing: '3px', textTransform: 'uppercase', color: '#111' }}>ARYAN SHARMA</div>
    <div style={{ fontSize: 7.5, color: '#059669', letterSpacing: '1px', marginTop: 2 }}>Full Stack Developer</div>
    <div style={{ fontSize: 6.5, color: '#666', marginTop: 3, marginBottom: 8 }}>aryan@gmail.com • +91 98765 43210 • Dehradun</div>
    <div style={{ height: .5, background: '#e5e7eb', marginBottom: 7 }} />
    <div style={{ fontSize: 6.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#059669', marginBottom: 3 }}>Experience</div>
    <ExpRow title="Software Developer" company="TechNova Solutions, Noida" date="2022–Present" color="#059669" bullets={['APIs for 50k+ daily users', '40% faster React dashboards', 'AWS CI/CD pipelines']} />
    <div style={{ height: .5, background: '#e5e7eb', margin: '7px 0' }} />
    <div style={{ fontSize: 6.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#059669', marginBottom: 3 }}>Skills</div>
    <div style={{ fontSize: 6.5, color: '#444', marginBottom: 7 }}>React.js • Node.js • MongoDB • Python • AWS • Docker</div>
    <div style={{ height: .5, background: '#e5e7eb', margin: '7px 0' }} />
    <div style={{ fontSize: 6.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#059669', marginBottom: 3 }}>Education</div>
    <div style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>B.Tech – Computer Science</div>
    <div style={{ fontSize: 6.5, color: '#666' }}>COER University, Roorkee • 2018–2022 • CGPA 8.4</div>
  </div>
);

export const ExecutiveCV = () => (
  <div style={{ background: '#fff', fontFamily: 'Georgia,serif', fontSize: 8, minHeight: 380 }}>
    <div style={{ background: '#1e293b', color: '#fff', padding: '14px 13px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>ARYAN SHARMA</div>
      <div style={{ fontSize: 7.5, color: '#f59e0b', marginTop: 3 }}>Full Stack Developer</div>
      <div style={{ fontSize: 6, color: '#94a3b8', marginTop: 4 }}>aryan@gmail.com • +91 98765 43210 • Dehradun</div>
    </div>
    <div style={{ padding: '11px 13px' }}>
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '.8px', borderBottom: '1.5px solid #f59e0b', paddingBottom: 2, marginBottom: 5 }}>Executive Summary</div>
      <div style={{ fontSize: 6.5, color: '#444', lineHeight: 1.55, marginBottom: 7 }}>Results-driven Full Stack Developer with 3+ years delivering scalable web solutions. Expert in React, Node.js, and AWS.</div>
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '.8px', borderBottom: '1.5px solid #f59e0b', paddingBottom: 2, marginBottom: 5 }}>Core Competencies</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 7 }}>
        {['React.js', 'Node.js', 'MongoDB', 'Python', 'AWS', 'Docker'].map(s => <span key={s} style={{ background: '#1e293b', color: '#f59e0b', padding: '1px 5px', fontSize: 6 }}>{s}</span>)}
      </div>
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '.8px', borderBottom: '1.5px solid #f59e0b', paddingBottom: 2, marginBottom: 5 }}>Professional Experience</div>
      <ExpRow title="Software Developer" company="TechNova Solutions, Noida" date="2022–Present" color="#b45309" bullets={['Built APIs for 50k+ daily users', 'React dashboards 40% faster', 'AWS CI/CD pipelines']} />
      <div style={{ fontSize: 6.5, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '.8px', borderBottom: '1.5px solid #f59e0b', paddingBottom: 2, marginBottom: 5 }}>Education</div>
      <div style={{ fontSize: 7, fontWeight: 700, color: '#111' }}>B.Tech – Computer Science</div>
      <div style={{ fontSize: 6.5, color: '#666' }}>COER University • 2018–2022 • CGPA 8.4</div>
    </div>
  </div>
);

export const MINI_PREVIEWS = [
  { id: 'classic', name: 'Classic', sub: 'ATS-friendly serif', free: true, Preview: ClassicCV },
  { id: 'modern', name: 'Modern Blue', sub: 'Sidebar accent', free: true, Preview: ModernBlueCV },
  { id: 'creative', name: 'Creative', sub: 'Bold & colorful', free: true, Preview: CreativeCV },
  { id: 'minimal', name: 'Minimal', sub: 'Clean & elegant', free: false, Preview: MinimalCV },
  { id: 'executive', name: 'Executive', sub: 'Premium dark header', free: false, Preview: ExecutiveCV },
];
