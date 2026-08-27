import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { API_BASE } from '../utils/api';
import '../styles/shell.css';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const redirectTo = location.state && location.state.from ? location.state.from : '/dashboard';
      const after = location.state && location.state.after ? location.state.after : undefined;
      navigate(redirectTo, { state: after ? { after } : {} });
    } catch (err) {
      alert('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert('Signup successful! Please login to continue.');
      setIsSignup(false);
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
    } catch (err) {
      alert('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const highlights = [
    { icon: 'style', text: '20+ professional resume templates' },
    { icon: 'auto_fix_high', text: 'AI writes summaries and bullet points' },
    { icon: 'shield', text: 'ATS score checks against any job post' },
    { icon: 'cloud_done', text: 'Cloud save — edit from anywhere' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", background: 'var(--paper, #f4f6fa)' }}>
      <style>{`
        .auth-brand { display: flex; }
        @media (max-width: 860px) { .auth-brand { display: none; } }
      `}</style>

      {/* Dark brand panel */}
      <section className="auth-brand" style={{
        width: '46%',
        background: 'radial-gradient(600px 400px at 20% 0%, rgba(99,102,241,.32), transparent 60%), linear-gradient(160deg, #101a2e, #0b1220)',
        borderRight: '1px solid rgba(148,163,184,.14)',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '56px 60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 44 }}>
          <div className="shell-logo" style={{ width: 40, height: 40, fontSize: 17 }}>R</div>
          <span className="shell-brand-name" style={{ fontSize: 21 }}>Resume<em>AI</em></span>
        </div>

        <h1 style={{ margin: '0 0 14px', fontFamily: 'Geist, sans-serif', fontSize: 34, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.02em', color: '#f1f5fb', maxWidth: 420 }}>
          Your career deserves a{' '}
          <span style={{ background: 'linear-gradient(90deg,#a5b4fc,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            world-class resume
          </span>
        </h1>
        <p style={{ margin: '0 0 36px', fontSize: 15, lineHeight: 1.65, color: '#9aa8c0', maxWidth: 400 }}>
          Build, score, and tailor job applications with AI — trusted by job seekers across India.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {highlights.map((h) => (
            <div key={h.text} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(99,102,241,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#a5b4fc' }}>{h.icon}</span>
              </div>
              <span style={{ fontSize: 14, color: '#c3cddf' }}>{h.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Form panel */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30, justifyContent: 'center' }}>
            <div className="shell-logo" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>R</div>
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 19, fontWeight: 700, color: 'var(--ink, #101828)' }}>
              Resume<span style={{ color: 'var(--brand, #4f46e5)' }}>AI</span>
            </span>
          </div>

          <div className="card" style={{ padding: '32px 30px' }}>
            <h2 style={{ margin: '0 0 6px', fontFamily: 'Geist, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: 13.5, color: 'var(--muted)' }}>
              {isSignup
                ? 'Join free — build your first resume in minutes.'
                : 'Log in to your workspace and resumes.'}
            </p>

            <form onSubmit={isSignup ? handleSignup : handleLogin}>
              {isSignup && (
                <div style={{ marginBottom: 14 }}>
                  <label className="label" htmlFor="name">Full Name</label>
                  <input
                    className="input"
                    id="name"
                    placeholder="e.g. Deepanshu Pal"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label className="label" htmlFor="email">Email Address</label>
                <input
                  className="input"
                  id="email"
                  placeholder="you@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label" htmlFor="password">Password</label>
                  {!isSignup && (
                    <Link to="/forgot-password" style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand)', textDecoration: 'none' }}>
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    id="password"
                    placeholder={isSignup ? 'Min 6 characters' : '••••••••'}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: 42 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 0, cursor: 'pointer', color: 'var(--muted)', padding: 2, display: 'flex' }}
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 19 }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px 0' }} disabled={loading}>
                {loading
                  ? (isSignup ? 'Creating account…' : 'Logging in…')
                  : (isSignup ? 'Create Account' : 'Login')}
              </button>
            </form>

            {!isSignup && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>or continue with</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        setGoogleLoading(true);
                        const res = await fetch(`${API_BASE}/api/auth/google`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ token: credentialResponse.credential }),
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          return alert(data.message);
                        }
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        const redirectTo =
                          location.state && location.state.from
                            ? location.state.from
                            : '/dashboard';
                        navigate(redirectTo);
                      } catch (err) {
                        console.log(err);
                        alert('Google Login Failed');
                      } finally {
                        setGoogleLoading(false);
                      }
                    }}
                    onError={() => {
                      alert('Google Login Failed');
                    }}
                  />
                </div>
              </>
            )}

            <p style={{ margin: '24px 0 0', textAlign: 'center', fontSize: 13.5, color: 'var(--body)' }}>
              {isSignup ? 'Already have an account?' : 'New to ResumeAI?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'var(--brand)', fontWeight: 700, fontSize: 13.5, fontFamily: 'inherit' }}
              >
                {isSignup ? 'Login' : 'Create an account'}
              </button>
            </p>
          </div>

          <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
