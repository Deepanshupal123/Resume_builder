import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { MINI_PREVIEWS } from '../components/TemplatePreviews';

/* Full catalogue — matches the templates available inside the Builder */
const CATALOG = [
  { id: 'classic', name: 'Classic', sub: 'ATS-friendly serif', free: true, accent: '#111111', layout: 'single' },
  { id: 'modern', name: 'Modern Blue', sub: 'Sidebar accent', free: true, accent: '#1a73e8', layout: 'side' },
  { id: 'creative', name: 'Creative', sub: 'Bold & colorful', free: true, accent: '#7c3aed', layout: 'band' },
  { id: 'minimal', name: 'Minimal', sub: 'Clean & elegant', free: false, accent: '#059669', layout: 'single' },
  { id: 'executive', name: 'Executive', sub: 'Premium dark header', free: false, accent: '#f59e0b', layout: 'band' },
  { id: 'stockholm', name: 'Stockholm', sub: 'Scandinavian clean', free: false, accent: '#0891b2', layout: 'side' },
  { id: 'newyork', name: 'New York', sub: 'Bold headlines', free: false, accent: '#dc2626', layout: 'single' },
  { id: 'tokyo', name: 'Tokyo', sub: 'Compact & precise', free: false, accent: '#be185d', layout: 'side' },
  { id: 'paris', name: 'Paris', sub: 'Elegant serif', free: false, accent: '#be185d', layout: 'band' },
  { id: 'london', name: 'London', sub: 'Traditional formal', free: false, accent: '#1d4ed8', layout: 'single' },
  { id: 'berlin', name: 'Berlin', sub: 'Modern grid', free: false, accent: '#059669', layout: 'side' },
  { id: 'sydney', name: 'Sydney', sub: 'Light & airy', free: false, accent: '#d97706', layout: 'band' },
  { id: 'dubai', name: 'Dubai', sub: 'Luxury gold accents', free: false, accent: '#f59e0b', layout: 'band' },
  { id: 'toronto', name: 'Toronto', sub: 'Balanced two-column', free: false, accent: '#dc2626', layout: 'side' },
  { id: 'singapore', name: 'Singapore', sub: 'Sharp & structured', free: false, accent: '#0891b2', layout: 'single' },
  { id: 'mumbai', name: 'Mumbai', sub: 'Vibrant & modern', free: false, accent: '#7c3aed', layout: 'band' },
  { id: 'chicago', name: 'Chicago', sub: 'Strong typography', free: false, accent: '#0f172a', layout: 'single' },
  { id: 'amsterdam', name: 'Amsterdam', sub: 'Creative minimal', free: false, accent: '#ea580c', layout: 'side' },
  { id: 'vienna', name: 'Vienna', sub: 'Classic refined', free: false, accent: '#4338ca', layout: 'band' },
  { id: 'osaka', name: 'Osaka', sub: 'Minimal precision', free: false, accent: '#0d9488', layout: 'single' },
];

/* Skeleton preview for templates without a full mini preview */
function SkeletonPreview({ accent, layout }) {
  const bar = (w, h = 5, bg = '#e6e9f0', mb = 5) => (
    <div style={{ width: w, height: h, background: bg, borderRadius: 3, marginBottom: mb }} />
  );
  if (layout === 'side') {
    return (
      <div style={{ display: 'flex', background: '#fff', minHeight: 380 }}>
        <div style={{ width: 72, background: accent, padding: '14px 9px', flexShrink: 0 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,.3)', margin: '0 auto 10px' }} />
          {bar('100%', 5, 'rgba(255,255,255,.45)')}
          {bar('80%', 4, 'rgba(255,255,255,.3)')}
          {bar('90%', 4, 'rgba(255,255,255,.3)', 12)}
          {bar('100%', 4, 'rgba(255,255,255,.3)')}
          {bar('75%', 4, 'rgba(255,255,255,.3)')}
          {bar('85%', 4, 'rgba(255,255,255,.3)')}
        </div>
        <div style={{ flex: 1, padding: '16px 14px' }}>
          {bar('62%', 9, '#252b37', 4)}
          {bar('38%', 5, accent, 14)}
          {bar('30%', 6, accent, 8)}
          {bar('100%')}{bar('94%')}{bar('88%', 5, '#e6e9f0', 14)}
          {bar('30%', 6, accent, 8)}
          {bar('100%')}{bar('90%')}{bar('96%')}
        </div>
      </div>
    );
  }
  if (layout === 'band') {
    return (
      <div style={{ background: '#fff', minHeight: 380 }}>
        <div style={{ background: accent, padding: '18px 16px' }}>
          {bar('55%', 10, 'rgba(255,255,255,.9)', 6)}
          {bar('35%', 5, 'rgba(255,255,255,.55)', 0)}
        </div>
        <div style={{ padding: '16px 14px' }}>
          {bar('28%', 6, accent, 8)}
          {bar('100%')}{bar('92%')}{bar('85%', 5, '#e6e9f0', 14)}
          {bar('28%', 6, accent, 8)}
          <div style={{ display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap' }}>
            {[38, 46, 34, 42].map((w, i) => (
              <div key={i} style={{ width: w, height: 11, borderRadius: 6, background: '#eef1f6' }} />
            ))}
          </div>
          {bar('28%', 6, accent, 8)}
          {bar('100%')}{bar('88%')}
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: '#fff', minHeight: 380, padding: '20px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{ width: '58%', height: 11, background: '#252b37', borderRadius: 3, margin: '0 auto 6px' }} />
        <div style={{ width: '40%', height: 5, background: '#c8cfdc', borderRadius: 3, margin: '0 auto' }} />
        <div style={{ height: 2, background: accent, marginTop: 12 }} />
      </div>
      {bar('30%', 6, accent, 8)}
      {bar('100%')}{bar('95%')}{bar('88%', 5, '#e6e9f0', 14)}
      {bar('30%', 6, accent, 8)}
      {bar('100%')}{bar('90%')}{bar('84%', 5, '#e6e9f0', 14)}
      {bar('30%', 6, accent, 8)}
      {bar('96%')}{bar('80%')}
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPro = user.isPro === true;
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CATALOG.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q)) return false;
      if (filter === 'free') return t.free;
      if (filter === 'pro') return !t.free;
      return true;
    });
  }, [filter, search]);

  const select = (t) => {
    if (!t.free && !isPro) {
      navigate('/pricing');
      return;
    }
    localStorage.removeItem('editResumeId');
    localStorage.setItem('selectedTemplate', t.id);
    navigate('/builder');
  };

  const previewFor = (t) => {
    const mini = MINI_PREVIEWS.find((m) => m.id === t.id);
    if (mini) {
      const P = mini.Preview;
      return <P />;
    }
    return <SkeletonPreview accent={t.accent} layout={t.layout} />;
  };

  return (
    <AppShell
      active="templates"
      title="Templates"
      subtitle={`${CATALOG.length} professional designs`}
    >
      <style>{`
        .tp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 1200px) { .tp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) { .tp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .tp-grid { grid-template-columns: 1fr; } }
        .tp-overlay {
          position: absolute; inset: 0;
          background: rgba(11,18,32,.55);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity .16s;
        }
        .tp-card:hover .tp-overlay { opacity: 1; }
      `}</style>

      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', maxWidth: 320, flex: 1, minWidth: 200 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#98a2b3', pointerEvents: 'none' }}>search</span>
          <input className="input" style={{ paddingLeft: 36 }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates…" />
        </div>
        <div style={{ display: 'flex', background: '#fff', border: '1px solid var(--line-strong)', borderRadius: 10, padding: 3, gap: 2 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'free', label: 'Free' },
            { id: 'pro', label: 'Premium' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 16px', borderRadius: 8, border: 0, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700,
                background: filter === f.id ? 'var(--brand-soft)' : 'transparent',
                color: filter === f.id ? 'var(--brand)' : 'var(--muted)',
                transition: 'background .14s, color .14s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!isPro && (
        <div className="hero-dark" style={{ padding: '16px 22px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#fbbf24' }}>workspace_premium</span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 14.5, fontWeight: 650, color: '#f1f5fb' }}>Unlock all {CATALOG.filter(t => !t.free).length} premium templates</div>
            <div style={{ fontSize: 12.5, color: '#9aa8c0', marginTop: 2 }}>Pro plan — ₹199/month, cancel anytime</div>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/pricing')}>Upgrade to Pro</button>
        </div>
      )}

      <div className="tp-grid">
        {items.map((t) => {
          const locked = !t.free && !isPro;
          return (
            <button key={t.id} type="button" className="card card-hover tp-card" onClick={() => select(t)}
              style={{ padding: 0, overflow: 'hidden', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', position: 'relative' }}>
              <div style={{ height: 220, overflow: 'hidden', position: 'relative', background: '#eef1f6' }}>
                <div style={{ margin: '14px 22px 0', borderRadius: '8px 8px 0 0', overflow: 'hidden', boxShadow: '0 6px 24px rgba(16,24,40,.14)' }}>
                  {previewFor(t)}
                </div>
                <div className="tp-overlay">
                  <span className="btn" style={{ background: '#fff', color: 'var(--navy-900)', fontWeight: 700, pointerEvents: 'none' }}>
                    {locked ? '🔒 Unlock with Pro' : 'Use Template'}
                  </span>
                </div>
              </div>
              <div style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)' }}>
                <div>
                  <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 13.5, fontWeight: 650, color: 'var(--ink)' }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{t.sub}</div>
                </div>
                {t.free ? <span className="pill green">Free</span> : <span className="pill gold">Pro</span>}
              </div>
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}
