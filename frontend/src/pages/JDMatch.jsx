
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

export default function JDMatch() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // ── File select / drag ────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (!allowed.includes(file.type)) {
      setError('Please upload only PDF or TXT files');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setResumeFile(file);
    setError('');
    setResult(null);
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleMatch = async () => {
    if (!resumeFile) { setError('Please upload your resume file'); return; }
    if (!jobDescription.trim()) { setError('Please paste the job description'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/ai/jd-match`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  // ── Score color ───────────────────────────────────────────────
  const getColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Strong Match 💪';
    if (score >= 60) return 'Good Match 👍';
    if (score >= 40) return 'Partial Match ⚠️';
    return 'Weak Match ❌';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 14, color: '#374151' }}
        >
          ← Back
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>🔍 JD Match Analyzer</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Upload resume + paste job description → keyword match + skill gap</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>

        {/* Input Section */}
        {!result && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

              {/* Resume Upload */}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  📄 Resume Upload (PDF / TXT)
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#ec4899' : resumeFile ? '#22c55e' : '#d1d5db'}`,
                    borderRadius: 12,
                    padding: '60px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragOver ? '#fdf2f8' : resumeFile ? '#f0fdf4' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {resumeFile ? (
                    <>
                      <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d' }}>{resumeFile.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
                        {(resumeFile.size / 1024).toFixed(1)} KB — Click to change
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 44, marginBottom: 10 }}>📤</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Click or Drag & Drop</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>PDF or TXT, max 5MB</div>
                    </>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  💼 Paste Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here...\n\nRequirements, skills, responsibilities — include everything"
                  style={{
                    width: '100%', height: 230, border: '2px solid #e5e7eb', borderRadius: 12,
                    padding: 16, fontSize: 13, color: '#374151', resize: 'vertical',
                    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, textAlign: 'right' }}>
                  {jobDescription.length} characters
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#dc2626', fontSize: 14 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleMatch}
                disabled={loading}
                style={{
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  color: 'white', border: 'none', borderRadius: 12,
                  padding: '14px 48px', fontSize: 16, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(236,72,153,0.4)',
                  transition: 'all 0.2s'
                }}
              >
                {loading ? '⏳ Analyzing...' : '🔍 Analyze Match'}
              </button>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, color: '#6b7280' }}>AI is analyzing keywords...</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>May take 10–15 seconds</div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Score Banner */}
            <div style={{
              background: `linear-gradient(135deg, ${getColor(result.matchScore)}22, ${getColor(result.matchScore)}11)`,
              border: `2px solid ${getColor(result.matchScore)}44`,
              borderRadius: 16, padding: '24px 32px', marginBottom: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
            }}>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Match Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, color: getColor(result.matchScore) }}>
                    {result.matchScore}%
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 600, color: '#374151' }}>{getLabel(result.matchScore)}</span>
                </div>
              </div>
              <div style={{ flex: 1, maxWidth: 300 }}>
                <div style={{ background: '#e5e7eb', borderRadius: 99, height: 16, overflow: 'hidden' }}>
                  <div style={{
                    width: `${result.matchScore}%`, background: getColor(result.matchScore),
                    height: '100%', borderRadius: 99, transition: 'width 1s ease'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
            </div>

            {/* 3 Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
              {/* Matched Skills */}
              <div style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '4px solid #22c55e' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#15803d' }}>
                  ✅ Matched Skills <span style={{ background: '#dcfce7', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>{result.matchedSkills?.length || 0}</span>
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.matchedSkills?.map((skill, i) => (
                    <span key={i} style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 500 }}>
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '4px solid #ef4444' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#dc2626' }}>
                  ❌ Missing Skills <span style={{ background: '#fee2e2', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>{result.missingSkills?.length || 0}</span>
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.missingSkills?.map((skill, i) => (
                    <span key={i} style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 500 }}>
                      ✗ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '4px solid #ec4899' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#be185d' }}>
                  💡 Suggestions
                </h3>
                {result.suggestions?.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>
                    <span style={{ color: '#ec4899', flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                onClick={() => { setResult(null); setResumeFile(null); setJobDescription(''); }}
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                🔄 Analyze Again
              </button>
              <button
                onClick={() => navigate('/ats-checker')}
                style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                🎯 ATS Checker
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                ← Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
