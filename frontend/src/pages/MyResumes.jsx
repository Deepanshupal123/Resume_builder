import { useNavigate } from 'react-router-dom';

export default function MyResumes() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#111318', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'rgba(160,202,255,.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#a0caff' }}>description</span>
        </div>
        <h2 style={{ fontFamily: 'Geist, sans-serif', fontSize: 22, fontWeight: 600, color: '#e2e2e8', marginBottom: 8 }}>My Resumes</h2>
        <p style={{ fontSize: 14, color: '#8a919e', marginBottom: 28 }}>Coming soon — your saved resumes will appear here.</p>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', border: 'none', borderRadius: 10, color: '#fff', fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
