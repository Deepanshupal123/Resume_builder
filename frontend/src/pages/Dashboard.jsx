import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import AppShell from '../components/AppShell';
import { MINI_PREVIEWS } from '../components/TemplatePreviews';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [resumes, setResumes] = useState([]);
  const [isPro, setIsPro] = useState(user.isPro === true);
  const [search, setSearch] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [listRes, subRes] = await Promise.all([
          apiFetch('/api/resume/list'),
          apiFetch('/api/subscription/status'),
        ]);
        if (listRes.ok) {
          const listData = await listRes.json();
          setResumes(listData.resumes || []);
        }
        if (subRes.ok) {
          const subData = await subRes.json();
          setIsPro(!!subData.isPro);
          const stored = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...stored, isPro: !!subData.isPro }));
        }
      } catch {
        /* offline — keep local state */
      } finally {
        setLoadingData(false);
      }
    })();
  }, []);

  const firstName = (user.name || 'there').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const filteredResumes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return resumes;
    return resumes.filter(
      (r) =>
        (r.title || '').toLowerCase().includes(q) ||
        (r.template || '').toLowerCase().includes(q)
    );
  }, [resumes, search]);

  const recentResumes = filteredResumes.slice(0, 5);
  const lastEdited = resumes[0]?.updatedAt
    ? new Date(resumes[0].updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '—';

  const openBuilderNew = () => {
    localStorage.removeItem('editResumeId');
    navigate('/builder');
  };

  const openBuilderEdit = (r) => {
    localStorage.setItem('editResumeId', r._id);
    if (r.template) localStorage.setItem('selectedTemplate', r.template);
    navigate('/builder');
  };

  const selectTemplate = (t) => {
    if (!t.free && !isPro) {
      navigate('/pricing');
      return;
    }
    localStorage.removeItem('editResumeId');
    localStorage.setItem('selectedTemplate', t.id);
    navigate('/builder');
  };

  const stats = [
    { icon: 'folder_open', tint: '#4f46e5', bg: '#eef2ff', label: 'Total Resumes', value: loadingData ? '…' : String(resumes.length), note: resumes.length ? 'Saved to cloud' : 'Create your first' },
    { icon: 'workspace_premium', tint: '#b45309', bg: '#fef3c7', label: 'Current Plan', value: isPro ? 'Pro' : 'Free', note: isPro ? 'All templates unlocked' : '20+ templates on Pro' },
    { icon: 'history', tint: '#067647', bg: '#ecfdf3', label: 'Last Edited', value: lastEdited, note: resumes[0]?.title || 'No activity yet' },
    { icon: 'bolt', tint: '#0e7490', bg: '#ecfeff', label: 'AI Tools', value: '5', note: 'Writer · ATS · JD · More' },
  ];

  const tools = [
    { icon: 'edit_note', tint: '#4f46e5', bg: '#eef2ff', title: 'Resume Builder', desc: 'Craft your resume in 20+ designer layouts with live preview and cloud save.', cta: 'Open builder', onClick: openBuilderNew },
    { icon: 'auto_fix_high', tint: '#7c3aed', bg: '#f5f3ff', title: 'AI Resume Writer', desc: 'AI writes your summary and bullet points from your role and skills.', cta: 'Generate with AI', onClick: () => navigate('/resume') },
    { icon: 'mail', tint: '#067647', bg: '#ecfdf3', title: 'Cover Letter Studio', desc: 'Personalized, AI-generated cover letters matched to the job.', cta: 'Create letter', onClick: () => navigate('/cover-letter') },
    { icon: 'shield', tint: '#0e7490', bg: '#ecfeff', title: 'ATS Score Checker', desc: 'Scan your resume against any job post for keyword gaps.', cta: 'Check score', onClick: () => navigate('/ats-checker') },
    { icon: 'compare_arrows', tint: '#b45309', bg: '#fef3c7', title: 'JD Match Analyzer', desc: 'See exactly how well you match a job description.', cta: 'Analyze match', onClick: () => navigate('/jd-match') },
    { icon: 'psychology', tint: '#be185d', bg: '#fdf2f8', title: 'Deep AI Analysis', desc: 'Expert-level feedback on content quality and impact.', cta: 'Analyze resume', onClick: () => navigate('/analysis') },
  ];

  return (
    <AppShell
      active="dashboard"
      title="Dashboard"
      subtitle={`${greeting}, ${firstName}`}
      actions={
        <div style={{ position: 'relative', width: 230 }} className="dash-search-wrap">
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 17, color: '#98a2b3', pointerEvents: 'none' }}>search</span>
          <input
            className="input"
            style={{ paddingLeft: 34, paddingTop: 7, paddingBottom: 7, fontSize: 13 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resumes…"
          />
        </div>
      }
    >
      <style>{`
        .dash-hero-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 32px; align-items: center; }
        .dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .dash-tools { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .dash-tmpls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 1100px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
          .dash-tools, .dash-tmpls { grid-template-columns: repeat(2, 1fr); }
          .dash-hero-grid { grid-template-columns: 1fr; }
          .dash-hero-card { display: none; }
        }
        @media (max-width: 640px) {
          .dash-stats, .dash-tools, .dash-tmpls { grid-template-columns: 1fr; }
          .dash-search-wrap { display: none; }
        }
      `}</style>

      {/* ── Hero (dark band on light page = the mix) ── */}
      <section className="hero-dark" style={{ padding: '38px 40px', marginBottom: 28 }}>
        <div className="dash-hero-grid">
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 12 }}>
              {greeting}, {firstName} 👋
            </div>
            <h1 style={{ margin: '0 0 12px', fontFamily: 'Geist, sans-serif', fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.02em', color: '#f1f5fb' }}>
              Land your next role with a{' '}
              <span style={{ background: 'linear-gradient(90deg,#a5b4fc,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                standout resume
              </span>
            </h1>
            <p style={{ margin: '0 0 24px', fontSize: 14.5, lineHeight: 1.65, color: '#9aa8c0', maxWidth: 440 }}>
              Build, score, and tailor your applications with AI.{' '}
              {isPro ? 'You have full access to every template and tool.' : 'Start free — upgrade anytime for all premium templates.'}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary btn-lg" onClick={openBuilderNew}>
                <span className="material-symbols-outlined">add_circle</span>
                Create Resume
              </button>
              <button
                type="button"
                className="btn btn-lg"
                style={{ background: 'rgba(148,163,184,.12)', color: '#e6ebf4', border: '1px solid rgba(148,163,184,.25)' }}
                onClick={() => navigate('/resume')}
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                Generate with AI
              </button>
            </div>
          </div>
          <div className="dash-hero-card" style={{ borderRadius: 14, overflow: 'hidden', maxHeight: 270, boxShadow: '0 24px 50px rgba(0,0,0,.45)', transform: 'rotate(2deg)', border: '1px solid rgba(255,255,255,.14)' }}>
            {(() => { const P = MINI_PREVIEWS[0].Preview; return <P />; })()}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="dash-stats" style={{ marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} className="card card-hover" style={{ padding: '18px 20px' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: s.tint }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.note}</div>
          </div>
        ))}
      </section>

      {/* ── Tools ── */}
      <section style={{ marginBottom: 36 }}>
        <div className="sec-head">
          <div>
            <h2 className="sec-title"><span className="material-symbols-outlined">apps</span>Smart AI Toolbox</h2>
            <p className="sec-sub">Everything you need after the first draft</p>
          </div>
        </div>
        <div className="dash-tools">
          {tools.map((t) => (
            <button key={t.title} type="button" className="card card-hover" onClick={t.onClick}
              style={{ padding: 20, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: t.tint }}>{t.icon}</span>
              </div>
              <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 650, color: 'var(--ink)', marginBottom: 6 }}>{t.title}</div>
              <div style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.55, marginBottom: 14 }}>{t.desc}</div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: t.tint, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {t.cta} <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Recent resumes ── */}
      <section style={{ marginBottom: 36 }}>
        <div className="sec-head">
          <div>
            <h2 className="sec-title"><span className="material-symbols-outlined">history</span>Recent Resumes</h2>
            <p className="sec-sub">Pick up where you left off</p>
          </div>
          <button type="button" className="link-btn" onClick={() => navigate('/resumes')}>
            View all <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="table-wrap">
          {recentResumes.length === 0 ? (
            <div className="empty">
              <span className="material-symbols-outlined">draft</span>
              <p>
                {loadingData
                  ? 'Loading your resumes…'
                  : search
                    ? 'No resumes match your search.'
                    : 'No saved resumes yet. Create one in the builder and hit Save — it will appear here.'}
              </p>
              {!loadingData && !search && (
                <button type="button" className="btn btn-primary" onClick={openBuilderNew}>
                  <span className="material-symbols-outlined">add_circle</span>
                  Open Builder
                </button>
              )}
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Modified</th>
                  <th>Template</th>
                  <th style={{ width: 90 }}></th>
                </tr>
              </thead>
              <tbody>
                {recentResumes.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 30, height: 38, borderRadius: 7, background: 'var(--brand-soft)', border: '1px solid var(--brand-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--brand)' }}>article</span>
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.title || 'Untitled Resume'}</span>
                      </div>
                    </td>
                    <td>{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                    <td><span className="pill">{r.template || 'classic'}</span></td>
                    <td>
                      <button type="button" className="btn btn-soft btn-sm" onClick={() => openBuilderEdit(r)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── Templates ── */}
      <section>
        <div className="sec-head">
          <div>
            <h2 className="sec-title"><span className="material-symbols-outlined">style</span>Top Templates</h2>
            <p className="sec-sub">Same content, different design — pick what suits you</p>
          </div>
          <button type="button" className="link-btn" onClick={() => navigate('/templates')}>
            Browse all 20 <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div className="dash-tmpls">
          {MINI_PREVIEWS.map(({ id, name, sub, free, Preview }) => (
            <button key={id} type="button" className="card card-hover" onClick={() => selectTemplate({ id, free })}
              style={{ padding: 0, overflow: 'hidden', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: '#eef1f6' }}>
                <div style={{ margin: '14px 26px 0', borderRadius: '8px 8px 0 0', overflow: 'hidden', boxShadow: '0 6px 24px rgba(16,24,40,.14)' }}>
                  <Preview />
                </div>
              </div>
              <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)' }}>
                <div>
                  <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 13.5, fontWeight: 650, color: 'var(--ink)' }}>{name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
                </div>
                {free ? <span className="pill green">Free</span> : <span className="pill gold">Pro</span>}
              </div>
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
