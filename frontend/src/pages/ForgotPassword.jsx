import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Unable to send reset email.');
        return;
      }

      setMessage(data.message || 'If that email exists, a reset link has been generated.');
      if (data.resetUrl) {
        setMessage(`${data.message} Reset link: ${data.resetUrl}`);
      }
    } catch (err) {
      setMessage('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#64748B]">Password Recovery</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#111827]">Forgot your password?</h1>
        <p className="mt-3 text-sm text-[#45464d]">Enter your email and we will create a secure reset link for you.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#111827]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#000000] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none focus:border-[#111827]"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000000] py-3 text-sm font-semibold uppercase text-white transition hover:bg-[#64748B] disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <p className="mt-4 rounded-md border border-[#E2E8F0] bg-[#f8fafc] p-3 text-sm text-[#111827]">{message}</p>}

        <p className="mt-6 text-sm text-[#45464d]">
          Remembered it? <Link to="/login" className="font-semibold text-[#000000] hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
