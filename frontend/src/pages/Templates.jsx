import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const navigate = useNavigate();
  const handleSelect = (id) => {
    localStorage.setItem('selectedTemplate', id);
    navigate('/builder');
  };

  const templates = [
    { id: 'classic',   name: 'Classic',     sub: 'ATS-friendly',   color: '#a0caff' },
    { id: 'modern',    name: 'Modern Blue',  sub: 'Sidebar accent', color: '#4F46E5' },
    { id: 'creative',  name: 'Creative',     sub: 'Bold & colorful',color: '#d2bbff' },
    { id: 'minimal',   name: 'Minimal',      sub: 'Clean & elegant',color: '#2ECC71' },
    { id: 'executive', name: 'Executive',    sub: 'Premium dark',   color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#111318', fontFamily: 'Inter, sans-serif', color: '#e2e2e8' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#8a919e', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontFamily: 'inherit' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span> Back to Dashboard
        </button>
        <h1 style={{ fontFamily: 'Geist, sans-serif', fontSize: 26, fontWeight: 600, color: '#e2e2e8', marginBottom: 6 }}>Templates</h1>
        <p style={{ fontSize: 14, color: '#8a919e', marginBottom: 36 }}>Choose a template to start building your resume</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {templates.map((t) => (
            <div key={t.id} onClick={() => handleSelect(t.id)}
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid #404752', borderRadius: 18, padding: 24, cursor: 'pointer', transition: 'border-color .15s, transform .15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#404752'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ height: 120, background: 'rgba(255,255,255,.03)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '1px solid #404752' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: t.color }}>description</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e2e8', marginBottom: 4, fontFamily: 'Geist, sans-serif' }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#8a919e', marginBottom: 14 }}>{t.sub}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.color }}>Use this →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
