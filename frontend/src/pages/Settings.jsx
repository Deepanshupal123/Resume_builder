import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ minHeight: '100vh', background: '#111318', fontFamily: 'Inter, sans-serif', color: '#e2e2e8' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#8a919e', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontFamily: 'inherit' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span> Back to Dashboard
        </button>
        <h1 style={{ fontFamily: 'Geist, sans-serif', fontSize: 26, fontWeight: 600, color: '#e2e2e8', marginBottom: 6 }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#8a919e', marginBottom: 36 }}>Manage your account and preferences</p>

        {/* Profile card */}
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid #404752', borderRadius: 20, padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: '#8a919e', marginBottom: 20 }}>Profile</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e2e8' }}>{user.name || 'User'}</div>
              <div style={{ fontSize: 13, color: '#8a919e' }}>{user.email || 'user@example.com'}</div>
            </div>
          </div>
          {[
            { label: 'Full Name', value: user.name || '', placeholder: 'Enter your name' },
            { label: 'Email', value: user.email || '', placeholder: 'Enter your email' },
          ].map((f) => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8a919e', marginBottom: 6 }}>{f.label}</label>
              <input defaultValue={f.value} placeholder={f.placeholder}
                style={{ width: '100%', padding: '10px 14px', background: '#1d2024', border: '1px solid #404752', borderRadius: 10, color: '#e2e2e8', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            </div>
          ))}
          <button style={{ marginTop: 8, padding: '10px 22px', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontFamily: 'Geist, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
            Save Changes
          </button>
        </div>

        {/* Danger zone */}
        <div style={{ background: 'rgba(255,180,171,.04)', border: '1px solid rgba(255,180,171,.15)', borderRadius: 20, padding: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: '#ffb4ab', marginBottom: 16 }}>Danger Zone</div>
          <p style={{ fontSize: 13, color: '#8a919e', marginBottom: 16 }}>Once you delete your account, there is no going back.</p>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            style={{ padding: '10px 22px', background: 'rgba(255,180,171,.1)', border: '1px solid rgba(255,180,171,.25)', borderRadius: 10, color: '#ffb4ab', fontSize: 13, fontFamily: 'Geist, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
