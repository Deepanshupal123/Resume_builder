import { useNavigate } from 'react-router-dom';

export default function UpgradeModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 20, padding: '40px 36px',
          maxWidth: 440, width: '100%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>

        {/* Title */}
        <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: '#111827' }}>
          Pro Template
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
          Yeh template Pro plan mein available hai.<br />
          Sirf <strong style={{ color: '#6366f1' }}>₹199/month</strong> mein sab 20+ templates unlock karo!
        </p>

        {/* Features list */}
        <div style={{
          background: '#f8fafc', borderRadius: 12, padding: '16px 20px',
          marginBottom: 24, textAlign: 'left'
        }}>
          {[
            '✅ 20+ Premium Templates',
            '✅ Unlimited ATS Checks',
            '✅ AI Cover Letter Generator',
            '✅ JD Match Analyzer',
            '✅ No Watermark on PDF',
          ].map((f, i) => (
            <div key={i} style={{ fontSize: 13, color: '#374151', marginBottom: i < 4 ? 8 : 0 }}>{f}</div>
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={() => navigate('/pricing')}
          style={{
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', border: 'none', borderRadius: 10,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            marginBottom: 10,
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)'
          }}
        >
          🚀 Upgrade to Pro — ₹199/mo
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '11px',
            background: 'white', color: '#6b7280',
            border: '2px solid #e5e7eb', borderRadius: 10,
            fontSize: 14, fontWeight: 500, cursor: 'pointer'
          }}
        >
          Free plan se continue karo
        </button>
      </div>
    </div>
  );
}
