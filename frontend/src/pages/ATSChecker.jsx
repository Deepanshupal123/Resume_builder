import { useState, useRef } from 'react';
import { API_BASE } from '../utils/api';
import AppShell from '../components/AppShell';

export default function ATSChecker() {
  const fileInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

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

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/ai/ats-check`, {
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

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#d97706';
    if (score >= 40) return '#ea580c';
    return '#dc2626';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match!';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Poor Match';
  };

  const CircleScore = ({ score, size = 140 }) => {
    const r = (size / 2) - 12;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = getScoreColor(score);
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef1f6" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
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
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: '#667085', fontSize: 11 }}>
          /100
        </text>
      </svg>
    );
  };

  const ScoreBar = ({ label, value }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: 'var(--body)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: getScoreColor(value) }}>{value}%</span>
      </div>
      <div style={{ background: '#eef1f6', borderRadius: 6, height: 8 }}>
        <div style={{ width: `${value}%`, background: getScoreColor(value), height: 8, borderRadius: 6, transition: 'width 1s ease' }} />
      </div>
    </div>
  );

  return (
    <AppShell active="ats-checker" title="ATS Score Checker" subtitle="Upload resume + job description — AI returns a detailed score">
      <style>{`
        .ats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 860px) { .ats-grid { grid-template-columns: 1fr; } }
      `}</style>

      {!result && (
        <>
          <div className="ats-grid" style={{ marginBottom: 20 }}>
            {/* Upload */}
            <div className="card card-pad">
              <label className="label" style={{ marginBottom: 10 }}>Resume Upload (PDF / TXT)</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--brand)' : resumeFile ? '#16a34a' : 'var(--line-strong)'}`,
                  borderRadius: 14,
                  padding: '44px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? 'var(--brand-soft)' : resumeFile ? 'var(--green-soft)' : '#fafbfd',
                  transition: 'all 0.2s',
                }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
                {resumeFile ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 38, color: '#16a34a' }}>task_alt</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)', marginTop: 8 }}>{resumeFile.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                      {(resumeFile.size / 1024).toFixed(1)} KB — click to change
                    </div>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 38, color: 'var(--brand)' }}>upload_file</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>Click or drag & drop</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>PDF or TXT, max 5MB</div>
                  </>
                )}
              </div>
            </div>

            {/* JD */}
            <div className="card card-pad">
              <label className="label" style={{ marginBottom: 10 }}>Paste Job Description</label>
              <textarea
                className="textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={'Paste the job description here…\n\nExample:\nWe are looking for a React Developer with 2+ years experience in JavaScript, Node.js, REST APIs…'}
                style={{ height: 180 }}
              />
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, textAlign: 'right' }}>
                {jobDescription.length} characters
              </div>
            </div>
          </div>

          {error && (
            <div className="card" style={{ padding: '12px 16px', marginBottom: 18, background: 'var(--red-soft)', borderColor: '#fecdca', color: 'var(--red)', fontSize: 13.5 }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button type="button" className="btn btn-primary btn-lg" onClick={handleCheck} disabled={loading}>
              {loading ? (
                <><span className="material-symbols-outlined spin">progress_activity</span>Analyzing…</>
              ) : (
                <><span className="material-symbols-outlined">shield</span>Check ATS Score</>
              )}
            </button>
            {loading && (
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 12 }}>
                AI is analyzing the resume — may take 10–20 seconds
              </div>
            )}
          </div>
        </>
      )}

      {result && (
        <div className="fade-in">
          {/* Score card */}
          <div className="card" style={{ padding: 28, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap' }}>
            <CircleScore score={result.score} />
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ background: getScoreColor(result.score), color: '#fff', borderRadius: 8, padding: '4px 14px', fontSize: 20, fontWeight: 700 }}>
                  {result.grade}
                </span>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 19, fontWeight: 650, color: 'var(--ink)' }}>{getScoreLabel(result.score)}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--body)', lineHeight: 1.6 }}>{result.summary}</p>

              {result.sections && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>Section Scores</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
                    {Object.entries(result.sections).map(([key, val]) => (
                      <ScoreBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div className="ats-grid" style={{ marginBottom: 18 }}>
            <div className="card card-pad" style={{ borderLeft: '4px solid #16a34a' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--green)', fontFamily: 'Geist, sans-serif' }}>
                Matched Keywords ({result.matchedKeywords?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.matchedKeywords?.map((kw, i) => (
                  <span key={i} className="pill green">{kw}</span>
                ))}
              </div>
            </div>
            <div className="card card-pad" style={{ borderLeft: '4px solid #dc2626' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--red)', fontFamily: 'Geist, sans-serif' }}>
                Missing Keywords ({result.missingKeywords?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.missingKeywords?.map((kw, i) => (
                  <span key={i} className="pill red">{kw}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths + improvements */}
          <div className="ats-grid" style={{ marginBottom: 24 }}>
            <div className="card card-pad">
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: 'Geist, sans-serif' }}>💪 Strengths</h3>
              {result.strengths?.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13.5, color: 'var(--body)' }}>
                  <span style={{ color: '#16a34a', flexShrink: 0 }}>✓</span> {s}
                </div>
              ))}
            </div>
            <div className="card card-pad">
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: 'Geist, sans-serif' }}>🔧 Improvements</h3>
              {result.improvements?.map((imp, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13.5, color: 'var(--body)' }}>
                  <span style={{ color: '#d97706', flexShrink: 0 }}>→</span> {imp}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => { setResult(null); setResumeFile(null); setJobDescription(''); }}>
              <span className="material-symbols-outlined">refresh</span>
              Check Again
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
