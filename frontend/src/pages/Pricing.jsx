import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import '../styles/shell.css';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Pricing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState(null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user && user._id) checkStatus();
  }, [user?._id]);

  const checkStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/subscription/status`, {
        headers: { ...getAuthHeaders() },
      });
      const data = await res.json();
      setIsPro(data.isPro);
      setSubscriptionEnd(data.subscriptionEnd);
      const updated = { ...user, isPro: data.isPro };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const existing = document.querySelector('script[data-razorpay]');
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.setAttribute('data-razorpay', 'true');
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const applyPro = (subscriptionEndValue, u) => {
    const updated = { ...u, isPro: true };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    setIsPro(true);
    setSubscriptionEnd(subscriptionEndValue);
    alert('Pro plan activated! You can now use all templates.');
  };

  const handlePayment = async () => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    if (!u || !u._id) {
      alert('Please login first!');
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    if (!localStorage.getItem('token')) {
      alert('Please log in again to upgrade.');
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    setLoading(true);
    try {
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error('Unable to load Razorpay');

      const orderRes = await fetch(`${API_BASE}/api/subscription/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ planType: 'pro' })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.message || 'Unable to start payment');
      }

      const keyId = orderData.keyId || process.env.REACT_APP_RAZORPAY_KEY_ID;
      if (!keyId) throw new Error('Razorpay key missing');

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ResumeAI Pro',
        description: 'Monthly Subscription — ₹199/month',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/subscription/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              applyPro(verifyData.subscriptionEnd, u);
            } else {
              alert(verifyData.message || 'Payment verification failed.');
            }
          } catch {
            alert('Payment completed but verification failed.');
          }
          setLoading(false);
        },
        prefill: {
          name: u.name || '',
          email: u.email || ''
        },
        theme: { color: '#4f46e5' },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        alert(resp?.error?.description || 'Payment failed');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const FREE_FEATURES = [
    '3 Resume Templates',
    'PDF Download',
    'Basic Editor with Cloud Save',
    'Cover Letter Builder',
    'ATS Score Checker (2/month)',
  ];

  const PRO_FEATURES = [
    '20+ Premium Templates',
    'Unlimited PDF Downloads',
    'AI Cover Letter Generator',
    'Unlimited ATS Score Checks',
    'JD Match Analyzer',
    'Priority Support',
    'No Watermark',
  ];

  const loggedIn = !!(user && user._id);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f4f6fa)', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .pr-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        @media (max-width: 800px) { .pr-cards { grid-template-columns: 1fr; } }
      `}</style>

      {/* Dark navy header band */}
      <div style={{
        background: 'radial-gradient(700px 320px at 15% -40%, rgba(99,102,241,.35), transparent 60%), linear-gradient(120deg, #101a2e, #0b1220)',
        borderBottom: '1px solid rgba(148,163,184,.14)',
        padding: '0 0 64px',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 46 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate(loggedIn ? '/dashboard' : '/')}>
              <div className="shell-logo">R</div>
              <span className="shell-brand-name">Resume<em>AI</em></span>
            </div>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: 'rgba(148,163,184,.1)', color: '#e6ebf4', border: '1px solid rgba(148,163,184,.22)' }}
              onClick={() => navigate(loggedIn ? '/dashboard' : '/login')}
            >
              {loggedIn ? '← Dashboard' : 'Login'}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 12 }}>
              Pricing
            </div>
            <h1 style={{ margin: '0 0 12px', fontFamily: 'Geist, sans-serif', fontSize: 36, fontWeight: 700, letterSpacing: '-.02em', color: '#f1f5fb' }}>
              Simple, transparent pricing
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: '#9aa8c0' }}>
              Start free — upgrade when you are ready
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '-40px auto 0', padding: '0 20px 64px' }}>
        {isPro && (
          <div className="card" style={{ padding: '18px 26px', marginBottom: 22, background: 'linear-gradient(120deg, #101a2e, #0b1220)', border: '1px solid rgba(245,158,11,.35)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 19, fontWeight: 700, color: '#fbbf24', marginBottom: 4 }}>🎉 Pro Plan Active</div>
            <div style={{ fontSize: 13, color: '#9aa8c0' }}>
              Valid till {subscriptionEnd ? new Date(subscriptionEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
            </div>
          </div>
        )}

        <div className="pr-cards">
          {/* Free */}
          <div className="card" style={{ padding: '32px 30px' }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em' }}>Free</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 40, fontWeight: 800, color: 'var(--ink)' }}>₹0</span>
                <span style={{ fontSize: 15, color: 'var(--muted)' }}>/month</span>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '8px 0 0' }}>Always free — no card required</p>
            </div>
            <div style={{ marginBottom: 26 }}>
              {FREE_FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 11, fontSize: 14, color: 'var(--body)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#16a34a', flexShrink: 0 }}>check_circle</span> {f}
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={() => navigate(loggedIn ? '/dashboard' : '/login')}>
              {loggedIn ? 'Current Plan' : 'Start Free'}
            </button>
          </div>

          {/* Pro */}
          <div className="hero-dark" style={{ padding: '32px 30px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 18, right: 18, background: '#fbbf24', color: '#78350f', borderRadius: 20, padding: '4px 14px', fontSize: 11.5, fontWeight: 800 }}>
              ⭐ Most Popular
            </div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.1em' }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 40, fontWeight: 800, color: '#f1f5fb' }}>₹199</span>
                <span style={{ fontSize: 15, color: '#9aa8c0' }}>/month</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#9aa8c0', margin: '8px 0 0' }}>Everything unlocked, cancel anytime</p>
            </div>
            <div style={{ marginBottom: 26 }}>
              {PRO_FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 11, fontSize: 14, color: '#dbe3f0' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#4ade80', flexShrink: 0 }}>check_circle</span> {f}
                </div>
              ))}
            </div>
            {isPro ? (
              <button type="button" className="btn" style={{ width: '100%', background: 'rgba(255,255,255,.16)', color: '#fff', cursor: 'default' }}>
                ✅ Active Plan
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handlePayment} disabled={loading}>
                {loading ? 'Opening Razorpay…' : 'Upgrade to Pro — ₹199/mo'}
              </button>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 36, flexWrap: 'wrap' }}>
          {[
            { icon: 'lock', text: 'Secure Payment' },
            { icon: 'undo', text: 'Cancel Anytime' },
            { icon: 'bolt', text: 'Instant Activation' },
            { icon: 'flag', text: 'Made for India' },
          ].map((b) => (
            <div key={b.text} style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--brand)' }}>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
