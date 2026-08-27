import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import AppShell, { initials } from '../components/AppShell';

export default function Settings() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('user') || '{}');

  const [name, setName] = useState(stored.name || '');
  const [email] = useState(stored.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null); // { ok, text }

  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  const [plan, setPlan] = useState({ isPro: stored.isPro === true, subscriptionEnd: null, loading: true });

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/subscription/status');
        if (res.ok) {
          const data = await res.json();
          setPlan({ isPro: !!data.isPro, subscriptionEnd: data.subscriptionEnd, loading: false });
          const u = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...u, isPro: !!data.isPro }));
        } else {
          setPlan((p) => ({ ...p, loading: false }));
        }
      } catch {
        setPlan((p) => ({ ...p, loading: false }));
      }
    })();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await apiFetch('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not save profile');
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...u, name: data.user.name }));
      setProfileMsg({ ok: true, text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ ok: false, text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (newPass.length < 6) {
      setPassMsg({ ok: false, text: 'New password must be at least 6 characters.' });
      return;
    }
    setSavingPass(true);
    try {
      const res = await apiFetch('/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: curPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not change password');
      setPassMsg({ ok: true, text: 'Password changed successfully.' });
      setCurPass('');
      setNewPass('');
    } catch (err) {
      setPassMsg({ ok: false, text: err.message });
    } finally {
      setSavingPass(false);
    }
  };

  const Msg = ({ msg }) =>
    msg ? (
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 10, fontSize: 13,
        background: msg.ok ? 'var(--green-soft)' : 'var(--red-soft)',
        color: msg.ok ? 'var(--green)' : 'var(--red)',
        border: `1px solid ${msg.ok ? '#a6f4c5' : '#fecdca'}`,
      }}>
        {msg.text}
      </div>
    ) : null;

  return (
    <AppShell active="settings" title="Settings" subtitle="Manage your account and preferences">
      <style>{`
        .st-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 18px; align-items: start; }
        @media (max-width: 980px) { .st-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="st-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Profile */}
          <div className="card card-pad">
            <div className="sec-title" style={{ fontSize: 16, marginBottom: 18 }}>
              <span className="material-symbols-outlined">person</span>Profile
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div className="avatar" style={{ width: 52, height: 52, fontSize: 17 }}>{initials(name)}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 650, color: 'var(--ink)', fontFamily: 'Geist, sans-serif' }}>{name || 'User'}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{email}</div>
              </div>
            </div>
            <form onSubmit={saveProfile}>
              <div style={{ marginBottom: 14 }}>
                <label className="label">Full Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="label">Email</label>
                <input className="input" value={email} disabled style={{ background: '#f9fafb', color: 'var(--muted)' }} />
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 5 }}>Email cannot be changed — it is your login ID.</div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? 'Saving…' : 'Save Changes'}
              </button>
              <Msg msg={profileMsg} />
            </form>
          </div>

          {/* Password */}
          <div className="card card-pad">
            <div className="sec-title" style={{ fontSize: 16, marginBottom: 18 }}>
              <span className="material-symbols-outlined">lock</span>Change Password
            </div>
            <form onSubmit={changePassword}>
              <div style={{ marginBottom: 14 }}>
                <label className="label">Current Password</label>
                <input className="input" type="password" value={curPass} onChange={(e) => setCurPass(e.target.value)} placeholder="••••••••" required />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="label">New Password</label>
                <input className="input" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Min 6 characters" required />
              </div>
              <button type="submit" className="btn btn-ghost" disabled={savingPass}>
                {savingPass ? 'Updating…' : 'Update Password'}
              </button>
              <Msg msg={passMsg} />
            </form>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>
              Signed up with Google? Password login may not be set for your account.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Plan */}
          <div className="hero-dark" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#fbbf24' }}>workspace_premium</span>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 650, color: '#f1f5fb' }}>Your Plan</span>
            </div>
            {plan.loading ? (
              <div style={{ fontSize: 13, color: '#9aa8c0' }}>Checking subscription…</div>
            ) : plan.isPro ? (
              <>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fbbf24', fontFamily: 'Geist, sans-serif', marginBottom: 6 }}>Pro ✦</div>
                <div style={{ fontSize: 13, color: '#9aa8c0', marginBottom: 4 }}>All 20 templates and AI tools unlocked.</div>
                {plan.subscriptionEnd && (
                  <div style={{ fontSize: 12.5, color: '#9aa8c0' }}>
                    Valid till {new Date(plan.subscriptionEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#f1f5fb', fontFamily: 'Geist, sans-serif', marginBottom: 6 }}>Free</div>
                <div style={{ fontSize: 13, color: '#9aa8c0', marginBottom: 16 }}>
                  3 templates, basic tools. Upgrade to unlock all 20 premium templates and unlimited AI checks.
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate('/pricing')}>
                  Upgrade to Pro — ₹199/mo
                </button>
              </>
            )}
          </div>

          {/* Data */}
          <div className="card card-pad">
            <div className="sec-title" style={{ fontSize: 16, marginBottom: 14 }}>
              <span className="material-symbols-outlined">database</span>Your Data
            </div>
            <p style={{ fontSize: 13, color: 'var(--body)', margin: '0 0 14px', lineHeight: 1.6 }}>
              Resumes you save in the builder are stored securely in your account. Manage them from My Resumes.
            </p>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/resumes')}>
              <span className="material-symbols-outlined">folder_open</span>
              Open My Resumes
            </button>
          </div>

          {/* Session */}
          <div className="card card-pad" style={{ borderColor: '#fecdca' }}>
            <div className="sec-title" style={{ fontSize: 16, marginBottom: 12 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--red)' }}>logout</span>Session
            </div>
            <p style={{ fontSize: 13, color: 'var(--body)', margin: '0 0 14px' }}>
              Sign out from this device. Your saved resumes stay safe in your account.
            </p>
            <button
              type="button"
              className="btn btn-danger-soft btn-sm"
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
