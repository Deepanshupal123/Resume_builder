import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Scroll Animation Hook ─── */
function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('sav');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    const els = document.querySelectorAll('.sa');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Count-Up Hook ─── */
function useCountUp(target, suffix = '', duration = 2000) {
  const ref = useRef(null);
  const triggered = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { start = target; clearInterval(timer); }
          if (ref.current) ref.current.textContent = Math.floor(start).toLocaleString() + suffix;
        }, 16);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, suffix, duration]);
  return ref;
}

/* ─── Global CSS injected once ─── */
const css = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideL   { from{opacity:0;transform:translateX(-44px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideR   { from{opacity:0;transform:translateX(44px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
  @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  .hero-left  { animation: slideL 0.75s cubic-bezier(.22,.68,0,1.2) both; }
  .hero-right { animation: slideR 0.75s cubic-bezier(.22,.68,0,1.2) 0.15s both; }
  .hero-badge { animation: scaleIn 0.5s ease 0.05s both; }
  .float-card { animation: floatY 4s ease-in-out infinite; }

  /* scroll-animate: hidden until .sav added */
  .sa { opacity:0; transform:translateY(28px); transition:opacity 0.6s ease,transform 0.6s ease; }
  .sa.sav, .sav { opacity:1; transform:translateY(0); }
  .d1{transition-delay:0.05s} .d2{transition-delay:0.15s} .d3{transition-delay:0.25s}
  .d4{transition-delay:0.35s} .d5{transition-delay:0.45s} .d6{transition-delay:0.55s}

  /* hover lift */
  .lift { transition:transform 0.25s ease,box-shadow 0.25s ease; }
  .lift:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,0,0,0.10); }

  /* button pulse */
  .btn-primary { transition:transform 0.2s ease,box-shadow 0.2s ease; }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(37,99,235,0.45)!important; }
  .btn-primary:active { transform:translateY(0); }

  .btn-sec { transition:border-color 0.2s,background 0.2s; }
  .btn-sec:hover { background:#f0f4ff!important; border-color:#2563eb!important; }

  /* navbar link */
  .nav-link { position:relative; }
  .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px;
    background:linear-gradient(90deg,#2563eb,#7c3aed); transition:width 0.25s ease; }
  .nav-link:hover::after { width:100%; }

  /* template tab */
  .tmpl-btn { transition:all 0.2s ease; }
  .tmpl-btn:hover { background:#e0e7ff!important; color:#2563eb!important; }
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollAnimation();

  const usersRef   = useCountUp(50000,  'K+'.replace('K+',''), 2000);
  // Simple stat refs — we'll just show static values for rating
  const resumeRef  = useCountUp(120000, '', 2200);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById('rai-anim')) {
      const s = document.createElement('style');
      s.id = 'rai-anim';
      s.textContent = css;
      document.head.appendChild(s);
    }
  }, []);

  const templates = ['Stockholm', 'New York', 'Vienna', 'Dubai', 'Tokyo'];
  const templateColors = [
    'linear-gradient(90deg,#2563eb,#7c3aed)',
    '#0f172a',
    '#7c3aed',
    'linear-gradient(90deg,#d97706,#b45309)',
    'linear-gradient(90deg,#dc2626,#b91c1c)',
  ];

  const features = [
    { icon: '🤖', title: 'AI-Powered Writing', desc: 'Groq AI se professional resume content generate hoga seconds mein' },
    { icon: '🎨', title: '10 Premium Templates', desc: 'Stockholm, New York, Dubai — world-class designs' },
    { icon: '📊', title: 'ATS Score Checker', desc: 'Recruiter ke ATS system se match karo apna resume' },
    { icon: '⚡', title: 'Live Preview', desc: 'Type karo aur instantly dekho resume kaisa dikhega' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Kahi bhi, kabhi bhi apna resume banao' },
    { icon: '💾', title: 'PDF Download', desc: 'One click mein professional PDF download karo' },
  ];

  const steps = [
    { num: '01', title: 'Details Bharo', desc: 'Apni personal info, experience aur skills fill karo simple form mein' },
    { num: '02', title: 'AI Generate Kare', desc: 'Hamara AI aapki details se professional resume content likhega' },
    { num: '03', title: 'Download Karo', desc: 'Apna pasandida template choose karo aur PDF download karo' },
  ];

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Software Developer, Bangalore', text: 'ResumeAI ne mera resume itna professional bana diya ki mujhe 3 interviews mile ek hafte mein!', avatar: '👨‍💻', company: 'Hired at TCS' },
    { name: 'Priya Patel', role: 'MBA Graduate, Mumbai', text: 'Mujhe nahi pata tha resume kaise likhte hain — ResumeAI ne sab automatically kar diya!', avatar: '👩‍💼', company: 'Hired at Deloitte' },
    { name: 'Arjun Singh', role: 'Fresh Graduate, Delhi', text: 'Stockholm template ne mere resume ko bilkul LinkedIn level bana diya. Highly recommended!', avatar: '👨‍🎓', company: 'Hired at Infosys' },
  ];

  return (
    <div style={{ fontFamily: 'Inter,Arial,sans-serif', color: '#111', background: '#fff', overflowX: 'hidden', scrollBehavior: 'smooth' }}>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid #f3f4f6' : 'none',
        padding: '16px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.35s ease',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.35)' }}>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '17px' }}>R</span>
          </div>
          <span style={{ fontWeight: '800', fontSize: '18px', color: '#0f172a' }}>ResumeAI</span>
        </div>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['features','templates','pricing'].map(id => (
            <a key={id} href={`#${id}`} className="nav-link"
              style={{ color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>
              {id}
            </a>
          ))}
          <button className="btn-sec" onClick={() => navigate('/login')}
            style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 18px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#111' }}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate('/signup')}
            style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', borderRadius: '9px', padding: '9px 22px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', color: '#fff', boxShadow: '0 3px 14px rgba(37,99,235,0.38)' }}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f4ff 0%,#faf5ff 50%,#fff 100%)', display: 'flex', alignItems: 'center', padding: '110px 48px 70px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '60px', width: '100%' }}>

          {/* Left */}
          <div className="hero-left" style={{ flex: 1 }}>
            <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', padding: '7px 16px', marginBottom: '26px' }}>
              <span>✨</span>
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700' }}>AI-Powered Resume Builder — Free</span>
            </div>

            <h1 style={{ fontSize: '54px', fontWeight: '800', lineHeight: '1.08', marginBottom: '20px', color: '#0f172a' }}>
              Job-Winning Resume<br />
              <span style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Banao Minutes Mein
              </span>
            </h1>

            <p style={{ fontSize: '18px', color: '#64748b', lineHeight: '1.75', marginBottom: '34px', maxWidth: '460px' }}>
              AI se professional resume generate karo. 10 world-class templates. ATS-friendly format. Bilkul free mein shuru karo!
            </p>

            <div style={{ display: 'flex', gap: '14px', marginBottom: '44px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => navigate('/signup')}
                style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', borderRadius: '12px', padding: '15px 30px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', color: '#fff', boxShadow: '0 4px 20px rgba(37,99,235,0.42)' }}>
                🚀 Free Resume Banao
              </button>
              <button className="btn-sec" onClick={() => navigate('/login')}
                style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '15px 28px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', color: '#111' }}>
                Login →
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '36px' }}>
              <div>
                <div ref={usersRef} style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>0</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Users</div>
              </div>
              <div>
                <div ref={resumeRef} style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>0</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Resumes</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>4.8★</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Rating</div>
              </div>
            </div>
          </div>

          {/* Right — Resume Card */}
          <div className="hero-right float-card" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 24px 70px rgba(37,99,235,0.13)', padding: '28px', width: '340px', border: '1px solid #e8edf5', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '-14px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: '10px', padding: '7px 14px', color: '#fff', fontSize: '11px', fontWeight: '800', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
                AI Generated ✨
              </div>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #2563eb', paddingBottom: '14px', marginBottom: '14px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px' }}>👤</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Rahul Sharma</div>
                <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>Full Stack Developer</div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>rahul@email.com • +91 98765 43210 • Delhi</div>
              </div>
              <ResumeSection title="Summary">
                <p style={{ fontSize: '9px', color: '#555', lineHeight: '1.6', margin: 0 }}>Results-driven developer with 3+ years experience building scalable web applications...</p>
              </ResumeSection>
              <ResumeSection title="Skills">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {['React','Node.js','MongoDB','Python','AWS'].map(s => (
                    <span key={s} style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 7px', borderRadius: '10px', fontSize: '8px', fontWeight: '700' }}>{s}</span>
                  ))}
                </div>
              </ResumeSection>
              <ResumeSection title="Experience">
                <div style={{ fontSize: '9px' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>Software Developer</div>
                  <div style={{ color: '#666', fontStyle: 'italic' }}>TCS • 2022–Present</div>
                  <div style={{ color: '#555', marginTop: '3px', lineHeight: '1.5' }}>• Built React dashboards serving 10K+ users<br />• Reduced load time by 40%</div>
                </div>
              </ResumeSection>
              <ResumeSection title="Education">
                <div style={{ fontSize: '9px' }}>
                  <div style={{ fontWeight: '700' }}>B.Tech Computer Science</div>
                  <div style={{ color: '#666' }}>IIT Delhi • 2022</div>
                </div>
              </ResumeSection>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section style={{ padding: '90px 48px', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="sa" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>How It Works</div>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a' }}>3 Steps Mein Resume Ready</h2>
          </div>
          <div style={{ display: 'flex', gap: '32px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '36px', left: '16%', right: '16%', height: '2px', background: 'linear-gradient(90deg,#2563eb,#7c3aed)', zIndex: 0 }} />
            {steps.map((step, i) => (
              <div key={i} className={`sa d${i + 1}`} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,99,235,0.32)' }}>
                  <span style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>{step.num}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.65' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" style={{ padding: '90px 48px', background: '#f8fafc', scrollMarginTop: '100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="sa" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Features</div>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a' }}>Sab Kuch Ek Jagah</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} className={`sa lift d${i + 1}`}
                style={{ background: '#fff', borderRadius: '18px', padding: '30px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '34px', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.65', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TEMPLATES ══════════ */}
      <section id="templates" style={{ padding: '90px 48px', background: '#fff', scrollMarginTop: '100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="sa" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Templates</div>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a' }}>10 World-Class Designs</h2>
            <p style={{ fontSize: '16px', color: '#64748b', marginTop: '12px' }}>Stockholm se Dubai tak — har profession ke liye perfect template</p>
          </div>

          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
            {templates.map((t, i) => (
              <button key={i} className="tmpl-btn" onClick={() => setActiveTemplate(i)}
                style={{ padding: '9px 22px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700',
                  background: activeTemplate === i ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#f1f5f9',
                  color: activeTemplate === i ? '#fff' : '#64748b',
                  boxShadow: activeTemplate === i ? '0 4px 14px rgba(37,99,235,0.35)' : 'none',
                }}>
                {t}
              </button>
            ))}
          </div>

          {/* Template previews */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {[0, 1, 2].map((i) => {
              const idx = (activeTemplate + i) % templates.length;
              return (
                <div key={i} className={`sa lift d${i + 1}`}
                  style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px', border: `2px solid ${i === 0 ? '#2563eb' : '#f1f5f9'}`, position: 'relative', overflow: 'hidden' }}>
                  {i === 0 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#2563eb', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>Popular</div>}
                  <div style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                    <div style={{ height: '8px', background: templateColors[idx], borderRadius: '4px', marginBottom: '10px' }} />
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '6px', width: '60%' }} />
                    <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', marginBottom: '4px' }} />
                    <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', marginBottom: '4px', width: '80%' }} />
                    <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', width: '70%' }} />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>{templates[idx]}</div>
                </div>
              );
            })}
          </div>

          <div className="sa" style={{ textAlign: 'center', marginTop: '36px' }}>
            <button className="btn-primary" onClick={() => navigate('/signup')}
              style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: 'none', borderRadius: '12px', padding: '14px 34px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', color: '#fff', boxShadow: '0 4px 18px rgba(37,99,235,0.38)' }}>
              Sab Templates Dekho →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section style={{ padding: '90px 48px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="sa" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Testimonials</div>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a' }}>Log Kya Kehte Hain</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className={`sa lift d${i + 1}`}
                style={{ background: '#fff', borderRadius: '18px', padding: '30px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '20px', marginBottom: '14px', letterSpacing: '2px' }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.75', marginBottom: '18px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>{t.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t.role}</div>
                  </div>
                  <div style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '10px', flexShrink: 0 }}>{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" style={{ padding: '90px 48px', background: '#fff', scrollMarginTop: '100px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="sa" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Pricing</div>
            <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a' }}>Simple Pricing</h2>
            <p style={{ fontSize: '16px', color: '#64748b', marginTop: '12px' }}>Shuru karo free mein — jab chahein upgrade karo</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {[
              {
                name: 'Free', price: '₹0', period: 'forever',
                bg: '#f8fafc', border: '#e5e7eb',
                btnBg: '#f1f5f9', btnColor: '#111', btnText: 'Get Started Free',
                features: ['1 Resume download','3 Basic templates','AI generation (3/month)','PDF export'],
              },
              {
                name: 'Pro', price: '₹199', period: '/month', popular: true,
                bg: 'linear-gradient(160deg,#eff6ff,#f5f3ff)', border: '#2563eb',
                btnBg: 'linear-gradient(135deg,#2563eb,#7c3aed)', btnColor: '#fff', btnText: 'Start Pro — ₹199/mo',
                features: ['Unlimited resumes','All 10 templates','AI generation unlimited','ATS Score checker','Cover letter AI','Job tracker','LinkedIn optimizer','Priority support'],
              },
            ].map((plan, i) => (
              <div key={i} className={`sa lift d${i + 1}`}
                style={{ background: plan.bg, borderRadius: '22px', padding: '34px', border: `2px solid ${plan.border}`, position: 'relative' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '5px 18px', borderRadius: '20px', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                  {plan.price}<span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>{plan.period}</span>
                </div>
                <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: '#444' }}>
                      <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '15px' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => navigate('/signup')}
                  style={{ width: '100%', background: plan.btnBg, border: 'none', borderRadius: '11px', padding: '13px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', color: plan.btnColor }}>
                  {plan.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section style={{ padding: '90px 48px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
        <div className="sa" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#fff', marginBottom: '16px', lineHeight: '1.15' }}>Aaj Hi Apna Dream Job Resume Banao!</h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.85)', marginBottom: '36px', lineHeight: '1.7' }}>
            50,000+ professionals ne ResumeAI use karke apna dream job paya. Aap bhi try karo — bilkul free!
          </p>
          <button className="btn-primary" onClick={() => navigate('/signup')}
            style={{ background: '#fff', border: 'none', borderRadius: '14px', padding: '17px 44px', fontSize: '17px', fontWeight: '800', cursor: 'pointer', color: '#2563eb', boxShadow: '0 6px 24px rgba(0,0,0,0.18)' }}>
            🚀 Free Mein Shuru Karo
          </button>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '44px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>R</span>
            </div>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>ResumeAI</span>
          </div>
          <div style={{ fontSize: '13px' }}>© 2026 ResumeAI. Made with ❤️ in India</div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
            {['Privacy','Terms','Contact'].map(l => (
              <a key={l} href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#fff'}
                onMouseLeave={e => e.target.style.color='#94a3b8'}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

function ResumeSection({ title, children }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ fontSize: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#2563eb', borderBottom: '1px solid #e5e7eb', paddingBottom: '3px', marginBottom: '6px' }}>{title}</div>
      {children}
    </div>
  );
}
