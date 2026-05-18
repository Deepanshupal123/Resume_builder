import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'https://resume-builder-7ngc.onrender.com';

export default function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState(null);
  const [user, setUser] = useState(() => {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
});

  useEffect(() => {
    if (user._id) checkStatus();
  }, [user._id]);

  const checkStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/payment/status/${user._id}`);
      const data = await res.json();
      setIsPro(data.isPro);
      setSubscriptionEnd(data.subscriptionEnd);
      // Update localStorage
      const updated = { ...user, isPro: data.isPro };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Lazy-load Razorpay checkout script only when needed
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

  // If router state indicates user came back to upgrade, trigger payment
  useEffect(() => {
    if (location && location.state && location.state.after === 'upgrade') {
      // reload latest user from localStorage in case Login updated it
      const latest = JSON.parse(localStorage.getItem('user') || '{}');
      if (latest && latest._id) {
        setUser(latest);
        // call payment with the fresh user object to avoid stale closures
        handlePayment(latest);
      }
      // clear router state so it doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, user._id]);

  const handlePayment = async (userParam) => {
    const fresh = JSON.parse(localStorage.getItem('user') || '{}');
  const u = userParam || fresh;
  if (!u || !u._id) {
      alert('Pehle login karo!');
      // redirect to login and pass the intent via router state
      navigate('/login', { state: { from: '/pricing', after: 'upgrade' } });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Order create karo
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: u._id })
      });
      const orderData = await orderRes.json();
      if (orderData.error) throw new Error(orderData.error);

      // Step 2: Razorpay checkout open karo
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ResumeAI Pro',
        description: 'Monthly Subscription - ₹199/month',
        order_id: orderData.orderId,
        handler: async (response) => {
          // Step 3: Verify payment
          const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: u._id
            })
          });
          const verifyData = await verifyRes.json();
            if (verifyData.success) {
            // localStorage update karo
            const updated = { ...u, isPro: true };
            localStorage.setItem('user', JSON.stringify(updated));
            setUser(updated);
            setIsPro(true);
            setSubscriptionEnd(verifyData.subscriptionEnd);
            alert('🎉 Pro plan activated! Ab sab templates use kar sakte ho!');
          } else {
            alert('Payment verification failed. Support se contact karo.');
          }
        },
        prefill: {
          name: u.name || '',
          email: u.email || ''
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      // ensure the checkout script is loaded
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error('Unable to load payment SDK');
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  const FREE_FEATURES = [
    '3 Resume Templates',
    'PDF Download',
    'Basic Editor',
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 14, color: '#374151' }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>💎 Pricing</h1>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', margin: 0 }}>
            Free mein shuru karo — jab ready ho tab upgrade karo
          </p>
        </div>

        {/* Active Subscription Banner */}
        {isPro && (
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 16, padding: '20px 28px', marginBottom: 32,
            color: 'white', textAlign: 'center'
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🎉 Pro Plan Active!</div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>
              Valid till: {subscriptionEnd ? new Date(subscriptionEnd).toLocaleDateString('en-IN') : 'N/A'}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

          {/* Free Plan */}
          <div style={{
            background: 'white', borderRadius: 20, padding: '36px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '2px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Free</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 800, color: '#111827' }}>₹0</span>
                <span style={{ fontSize: 16, color: '#6b7280' }}>/month</span>
              </div>
              <p style={{ fontSize: 14, color: '#6b7280', margin: '8px 0 0' }}>Hamesha free</p>
            </div>

            <div style={{ marginBottom: 28 }}>
              {FREE_FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: '#374151' }}>
                  <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                width: '100%', padding: '13px', borderRadius: 10,
                border: '2px solid #e5e7eb', background: 'white',
                fontSize: 15, fontWeight: 600, color: '#374151', cursor: 'pointer'
              }}
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 20, padding: '36px 32px',
            boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Popular badge */}
            <div style={{
              position: 'absolute', top: 16, right: 16,
              background: '#fbbf24', color: '#78350f',
              borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700
            }}>
              ⭐ Most Popular
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 800, color: 'white' }}>₹199</span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>/month</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: '8px 0 0' }}>Sab kuch unlock karo</p>
            </div>

            <div style={{ marginBottom: 28 }}>
              {PRO_FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: 'white' }}>
                  <span style={{ color: '#86efac', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </div>
              ))}
            </div>

            {isPro ? (
              <button
                style={{
                  width: '100%', padding: '13px', borderRadius: 10,
                  border: 'none', background: 'rgba(255,255,255,0.25)',
                  fontSize: 15, fontWeight: 600, color: 'white', cursor: 'default'
                }}
              >
                ✅ Active Plan
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                  width: '100%', padding: '13px', borderRadius: 10,
                  border: 'none', background: 'white',
                  fontSize: 15, fontWeight: 700, color: '#6366f1',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.1s'
                }}
              >
                {loading ? '⏳ Processing...' : '🚀 Upgrade to Pro — ₹199/mo'}
              </button>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
          {['🔒 Secure Payment', '↩️ Cancel Anytime', '⚡ Instant Activation', '🇮🇳 Made for India'].map((b, i) => (
            <div key={i} style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{b}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
