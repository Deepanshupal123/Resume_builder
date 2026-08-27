import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import '../styles/shell.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert('Password must be at least 6 characters long!');
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
      navigate('/login');
    } catch (err) {
      alert('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f4f6fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
          <div className="shell-logo">R</div>
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>
            Resume<span style={{ color: 'var(--brand)' }}>AI</span>
          </span>
        </div>

        <div className="card" style={{ padding: '32px 30px' }}>
          <h1 style={{ margin: '0 0 6px', fontFamily: 'Geist, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>Create account</h1>
          <p style={{ margin: '0 0 24px', fontSize: 13.5, color: 'var(--muted)' }}>Join ResumeAI for free — no card required</p>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px 0' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ margin: '22px 0 0', textAlign: 'center', fontSize: 13.5, color: 'var(--body)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
