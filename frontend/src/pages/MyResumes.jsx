import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import AppShell from '../components/AppShell';

export default function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const res = await apiFetch('/api/resume/list');
      if (!res.ok) throw new Error('Could not load resumes');
      const data = await res.json();
      setResumes(data.resumes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return resumes;
    return resumes.filter(
      (r) =>
        (r.title || '').toLowerCase().includes(q) ||
        (r.template || '').toLowerCase().includes(q)
    );
  }, [resumes, search]);

  const openNew = () => {
    localStorage.removeItem('editResumeId');
    navigate('/builder');
  };

  const openEdit = (r) => {
    localStorage.setItem('editResumeId', r._id);
    if (r.template) localStorage.setItem('selectedTemplate', r.template);
    navigate('/builder');
  };

  const duplicate = async (r) => {
    setBusyId(r._id);
    try {
      const res = await apiFetch('/api/resume/create', {
        method: 'POST',
        body: JSON.stringify({
          title: `${r.title || 'Untitled'} (copy)`,
          template: r.template,
          data: r.data || {},
        }),
      });
      if (!res.ok) throw new Error('Duplicate failed');
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const rename = async (r) => {
    const title = window.prompt('New title for this resume:', r.title || 'Untitled Resume');
    if (title === null || !title.trim()) return;
    setBusyId(r._id);
    try {
      const res = await apiFetch(`/api/resume/${r._id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!res.ok) throw new Error('Rename failed');
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete "${r.title || 'Untitled Resume'}"? This cannot be undone.`)) return;
    setBusyId(r._id);
    try {
      const res = await apiFetch(`/api/resume/${r._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      if (localStorage.getItem('editResumeId') === r._id) {
        localStorage.removeItem('editResumeId');
      }
      setResumes((prev) => prev.filter((x) => x._id !== r._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AppShell
      active="resumes"
      title="My Resumes"
      subtitle={`${resumes.length} saved to cloud`}
      actions={
        <button type="button" className="btn btn-primary btn-sm" onClick={openNew}>
          <span className="material-symbols-outlined">add_circle</span>
          New Resume
        </button>
      }
    >
      <style>{`
        .mr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 1100px) { .mr-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .mr-grid { grid-template-columns: 1fr; } }
        .mr-action {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--line);
          background: #fff; color: var(--muted); cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background .14s, color .14s, border-color .14s;
        }
        .mr-action:hover { background: var(--brand-soft); color: var(--brand); border-color: var(--brand-line); }
        .mr-action.danger:hover { background: var(--red-soft); color: var(--red); border-color: #fecdca; }
        .mr-action:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>

      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', maxWidth: 340, flex: 1, minWidth: 220 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#98a2b3', pointerEvents: 'none' }}>search</span>
          <input className="input" style={{ paddingLeft: 36 }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or template…" />
        </div>
        <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
          {search ? `${filtered.length} match${filtered.length === 1 ? '' : 'es'}` : ''}
        </span>
      </div>

      {error && (
        <div className="card" style={{ padding: '14px 18px', marginBottom: 18, background: 'var(--red-soft)', borderColor: '#fecdca', color: 'var(--red)', fontSize: 13.5 }}>
          {error} — <button className="link-btn" style={{ color: 'var(--red)' }} onClick={load}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="card empty">
          <span className="material-symbols-outlined spin">progress_activity</span>
          <p>Loading your resumes…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty">
          <span className="material-symbols-outlined">draft</span>
          <p>
            {search
              ? 'No resumes match your search.'
              : 'You have no saved resumes yet. Create one in the builder and press Save (or Ctrl+S) — it will show up here.'}
          </p>
          {!search && (
            <button type="button" className="btn btn-primary" onClick={openNew}>
              <span className="material-symbols-outlined">add_circle</span>
              Create your first resume
            </button>
          )}
        </div>
      ) : (
        <div className="mr-grid">
          {filtered.map((r) => (
            <div key={r._id} className="card card-hover" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 42, height: 54, borderRadius: 8, background: 'var(--brand-soft)', border: '1px solid var(--brand-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--brand)' }}>article</span>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 14.5, fontWeight: 650, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.title || 'Untitled Resume'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                    Edited {fmtDate(r.updatedAt)}
                  </div>
                  <span className="pill" style={{ marginTop: 8 }}>{r.template || 'classic'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <button type="button" className="btn btn-soft btn-sm" style={{ flex: 1 }} onClick={() => openEdit(r)}>
                  <span className="material-symbols-outlined">edit</span>
                  Edit
                </button>
                <button type="button" className="mr-action" title="Duplicate" disabled={busyId === r._id} onClick={() => duplicate(r)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 17 }}>content_copy</span>
                </button>
                <button type="button" className="mr-action" title="Rename" disabled={busyId === r._id} onClick={() => rename(r)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 17 }}>drive_file_rename_outline</span>
                </button>
                <button type="button" className="mr-action danger" title="Delete" disabled={busyId === r._id} onClick={() => remove(r)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 17 }}>delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
