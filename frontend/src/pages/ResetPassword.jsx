import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
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
    } catch (err) {
      setMessage('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#64748B]">Reset Password</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#111827]">Create a new password</h1>
        <p className="mt-3 text-sm text-[#45464d]">Choose a strong password for your account.</p>

        {!isReady ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">Missing reset token.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#111827]">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#000000] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none focus:border-[#111827]"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#111827]">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[#000000] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none focus:border-[#111827]"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#000000] py-3 text-sm font-semibold uppercase text-white transition hover:bg-[#64748B] disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        )}

        {message && <p className="mt-4 rounded-md border border-[#E2E8F0] bg-[#f8fafc] p-3 text-sm text-[#111827]">{message}</p>}

        <p className="mt-6 text-sm text-[#45464d]">
          <Link to="/login" className="font-semibold text-[#000000] hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
