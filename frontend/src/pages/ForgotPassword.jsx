import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import '../styles/shell.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResetUrl('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Unable to send reset email.');
        return;
      }

      setMessage(data.message || 'If that email exists, a reset link has been generated.');
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch {
      setMessage('Unable to connect to the server.');
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
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 10 }}>
            Password Recovery
          </div>
          <h1 style={{ margin: '0 0 8px', fontFamily: 'Geist, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            Forgot your password?
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>
            Enter your email and we will create a secure reset link for you.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px 0' }} disabled={loading}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>

          {message && (
            <p style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, fontSize: 13, background: '#f9fafb', border: '1px solid var(--line)', color: 'var(--body)' }}>
              {message}
            </p>
          )}

          {resetUrl && (
            <p style={{ marginTop: 10, fontSize: 13 }}>
              <a href={resetUrl} style={{ fontWeight: 700, color: 'var(--brand)', wordBreak: 'break-all' }}>
                Open reset password page
              </a>
            </p>
          )}

          <p style={{ margin: '22px 0 0', fontSize: 13.5, color: 'var(--body)' }}>
            Remembered it?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--brand)', textDecoration: 'none' }}>Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
