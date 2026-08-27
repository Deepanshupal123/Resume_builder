import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shell.css';

const NAV = [
  { sec: 'Workspace' },
  { id: 'dashboard', icon: 'space_dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'resumes', icon: 'folder_open', label: 'My Resumes', path: '/resumes' },
  { id: 'builder', icon: 'edit_note', label: 'Resume Builder', path: '/builder' },
  { id: 'templates', icon: 'style', label: 'Templates', path: '/templates' },
  { sec: 'AI Tools' },
  { id: 'resume', icon: 'auto_fix_high', label: 'AI Writer', path: '/resume' },
  { id: 'cover-letter', icon: 'mail', label: 'Cover Letter', path: '/cover-letter' },
  { id: 'ats-checker', icon: 'shield', label: 'ATS Checker', path: '/ats-checker' },
  { id: 'jd-match', icon: 'compare_arrows', label: 'JD Match', path: '/jd-match' },
  { id: 'analysis', icon: 'psychology', label: 'AI Analysis', path: '/analysis' },
  { sec: 'Account' },
  { id: 'pricing', icon: 'workspace_premium', label: 'Pricing', path: '/pricing' },
  { id: 'settings', icon: 'settings', label: 'Settings', path: '/settings' },
];

export function initials(name) {
  return (name || 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AppShell({ active, title, subtitle, actions, children, wide }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPro = user.isPro === true;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="shell">
      {open && <button className="shell-scrim show" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <aside className={`shell-sidebar${open ? ' open' : ''}`}>
        <div className="shell-brand" onClick={() => go('/dashboard')}>
          <div className="shell-logo">R</div>
          <span className="shell-brand-name">Resume<em>AI</em></span>
        </div>

        <nav className="shell-nav">
          {NAV.map((item) =>
            item.sec ? (
              <div key={item.sec} className="nav-sec">{item.sec}</div>
            ) : (
              <button
                key={item.id}
                type="button"
                className={`nav-btn${active === item.id ? ' active' : ''}`}
                onClick={() => go(item.path)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            )
          )}
        </nav>

        <div className="shell-user">
          <div className="shell-user-row">
            <div className="avatar">{initials(user.name)}</div>
            <div style={{ minWidth: 0 }}>
              <div className="shell-user-name">{user.name || 'User'}</div>
              <span className={`plan-chip ${isPro ? 'pro' : 'free'}`}>
                {isPro ? '✦ Pro Plan' : 'Free Plan'}
              </span>
            </div>
          </div>
          <button type="button" className="shell-signout" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <div className="shell-main">
        <header className="shell-top">
          <button type="button" className="shell-menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>menu</span>
          </button>
          <div style={{ minWidth: 0 }}>
            <div className="shell-top-title">{title}</div>
            {subtitle && <div className="shell-top-sub">{subtitle}</div>}
          </div>
          <div className="shell-top-actions">
            {actions}
            {!isPro && (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/pricing')}>
                <span className="material-symbols-outlined">workspace_premium</span>
                Upgrade
              </button>
            )}
            <div className="avatar" title={user.name || 'User'} style={{ width: 32, height: 32, fontSize: 11.5 }}>
              {initials(user.name)}
            </div>
          </div>
        </header>

        <main className={`shell-body${wide ? ' wide' : ''}`}>{children}</main>
      </div>
    </div>
  );
}
