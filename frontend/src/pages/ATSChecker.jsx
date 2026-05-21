import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://resume-builder-7ngc.onrender.com';

export default function ATSChecker() {
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
  const handleCheck = async () => {
    if (!resumeFile) { setError('Please upload your resume file'); return; }
    if (!jobDescription.trim()) { setError('Please paste the job description'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const res = await fetch(`${API_BASE}/api/ai/ats-check`, {
        method: 'POST',
        body: formData,
        // Note: don't set the Content-Type header — browser sets the multipart boundary automatically
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
  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match!';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Poor Match';
  };

  // ── Circle progress ───────────────────────────────────────────
  const CircleScore = ({ score, size = 140 }) => {
    const r = (size / 2) - 12;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = getScoreColor(score);
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: color, fontSize: 28, fontWeight: 700 }}>
          {score}
        </text>
        <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: '#6b7280', fontSize: 11 }}>
          /100
        </text>
      </svg>
    );
  };

  // ── Mini bar ──────────────────────────────────────────────────
  const ScoreBar = ({ label, value }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: getScoreColor(value) }}>{value}%</span>
      </div>
      <div style={{ background: '#e5e7eb', borderRadius: 6, height: 8 }}>
        <div style={{ width: `${value}%`, background: getScoreColor(value), height: 8, borderRadius: 6, transition: 'width 1s ease' }} />
      </div>
    </div>
  );

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
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>🎯 ATS Score Checker</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Upload resume + paste job description → AI will return a score</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        {/* Input Section */}
        {!result && (
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
                  border: `2px dashed ${dragOver ? '#6366f1' : resumeFile ? '#22c55e' : '#d1d5db'}`,
                  borderRadius: 12,
                  padding: '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? '#eef2ff' : resumeFile ? '#f0fdf4' : 'white',
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
                    <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d' }}>{resumeFile.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                      {(resumeFile.size / 1024).toFixed(1)} KB — Click to change
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>📤</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Click or Drag & Drop</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>PDF or TXT, max 5MB</div>
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
                placeholder="Paste the job description here...\n\nExample:\nWe are looking for a React Developer with 2+ years experience in JavaScript, Node.js, REST APIs..."
                style={{
                  width: '100%', height: 200, border: '2px solid #e5e7eb', borderRadius: 12,
                  padding: 16, fontSize: 13, color: '#374151', resize: 'vertical',
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  lineHeight: 1.6
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, textAlign: 'right' }}>
                {jobDescription.length} characters
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#dc2626', fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Check Button */}
        {!result && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <button
              onClick={handleCheck}
              disabled={loading}
              style={{
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', border: 'none', borderRadius: 12,
                padding: '14px 48px', fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? '⏳ Analyzing...' : '🚀 Check ATS Score'}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}>⚙️</div>
            <div style={{ fontSize: 16, color: '#6b7280' }}>AI is analyzing the resume...</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>May take 10–20 seconds</div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Top: Score + Grade */}
            <div style={{
              background: 'white', borderRadius: 16, padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap'
            }}>
              <CircleScore score={result.score} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{
                    background: getScoreColor(result.score), color: 'white',
                    borderRadius: 8, padding: '4px 14px', fontSize: 22, fontWeight: 700
                  }}>
                    {result.grade}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{getScoreLabel(result.score)}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>{result.summary}</p>

                {/* Section Scores */}
                {result.sections && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Section Scores:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
                      {Object.entries(result.sections).map(([key, val]) => (
                        <ScoreBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Keywords Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {/* Matched */}
              <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: '4px solid #22c55e' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#15803d' }}>✅ Matched Keywords ({result.matchedKeywords?.length || 0})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.matchedKeywords?.map((kw, i) => (
                    <span key={i} style={{ background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#dc2626' }}>❌ Missing Keywords ({result.missingKeywords?.length || 0})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths + Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#374151' }}>💪 Strengths</h3>
                {result.strengths?.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: '#4b5563' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span> {s}
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#374151' }}>🔧 Improvements</h3>
                {result.improvements?.map((imp, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: '#4b5563' }}>
                    <span style={{ color: '#f59e0b', flexShrink: 0 }}>→</span> {imp}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setResult(null); setResumeFile(null); setJobDescription(''); }}
                style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                🔄 Check Again
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
