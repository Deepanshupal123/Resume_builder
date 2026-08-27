import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import '../styles/shell.css';

/* Defined outside the page component so inputs keep focus across re-renders */
const PasswordField = ({ label, value, onChange, show, toggle, placeholder }) => (
  <div style={{ marginBottom: 16 }}>
    <label className="label">{label}</label>
    <div style={{ position: 'relative' }}>
      <input
        className="input"
        type={show ? 'text' : 'password'}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ paddingRight: 42 }}
      />
      <button
        type="button"
        onClick={toggle}
        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 0, cursor: 'pointer', color: 'var(--muted)', padding: 2, display: 'flex' }}
        aria-label="Toggle password visibility"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 19 }}>{show ? 'visibility_off' : 'visibility'}</span>
      </button>
    </div>
  </div>
);

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isReady = useMemo(() => Boolean(token), [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Unable to reset password.');
        return;
      }

      setMessage(data.message || 'Password reset successful. You can now log in.');
      setPassword('');
      setConfirmPassword('');
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
            Reset Password
          </div>
          <h1 style={{ margin: '0 0 8px', fontFamily: 'Geist, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            Create a new password
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 13.5, color: 'var(--muted)' }}>
            Choose a strong password for your account.
          </p>

          {!isReady ? (
            <p style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, background: 'var(--red-soft)', border: '1px solid #fecdca', color: 'var(--red)' }}>
              Missing reset token.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <PasswordField
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                placeholder="At least 6 characters"
              />
              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                show={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                placeholder="Repeat password"
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px 0', marginTop: 4 }} disabled={loading}>
                {loading ? 'Updating…' : 'Reset Password'}
              </button>
            </form>
          )}

          {message && (
            <p style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, fontSize: 13, background: '#f9fafb', border: '1px solid var(--line)', color: 'var(--body)' }}>
              {message}
            </p>
          )}

          <p style={{ margin: '22px 0 0', fontSize: 13.5 }}>
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--brand)', textDecoration: 'none' }}>Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
