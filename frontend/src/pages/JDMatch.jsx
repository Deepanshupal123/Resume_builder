import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import AppShell from '../components/AppShell';

export default function JDMatch() {
  const navigate = useNavigate();
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

  const getColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#d97706';
    if (score >= 40) return '#ea580c';
    return '#dc2626';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Strong Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Partial Match';
    return 'Weak Match';
  };

  return (
    <AppShell active="jd-match" title="JD Match Analyzer" subtitle="See how well your resume matches a job description">
      <style>{`
        .jd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .jd-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 1000px) { .jd-grid3 { grid-template-columns: 1fr; } }
        @media (max-width: 860px) { .jd-grid { grid-template-columns: 1fr; } }
      `}</style>

      {!result && (
        <>
          <div className="jd-grid" style={{ marginBottom: 20 }}>
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
                  padding: '54px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? 'var(--brand-soft)' : resumeFile ? 'var(--green-soft)' : '#fafbfd',
                  transition: 'all 0.2s',
                }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
                {resumeFile ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#16a34a' }}>task_alt</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)', marginTop: 8 }}>{resumeFile.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>
                      {(resumeFile.size / 1024).toFixed(1)} KB — click to change
                    </div>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--brand)' }}>upload_file</span>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>Click or drag & drop</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>PDF or TXT, max 5MB</div>
                  </>
                )}
              </div>
            </div>

            <div className="card card-pad">
              <label className="label" style={{ marginBottom: 10 }}>Paste Job Description</label>
              <textarea
                className="textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={'Paste the job description here…\n\nRequirements, skills, responsibilities — include everything'}
                style={{ height: 200 }}
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
            <button type="button" className="btn btn-primary btn-lg" onClick={handleMatch} disabled={loading}>
              {loading ? (
                <><span className="material-symbols-outlined spin">progress_activity</span>Analyzing…</>
              ) : (
                <><span className="material-symbols-outlined">compare_arrows</span>Analyze Match</>
              )}
            </button>
            {loading && (
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 12 }}>
                AI is analyzing keywords — may take 10–15 seconds
              </div>
            )}
          </div>
        </>
      )}

      {result && (
        <div className="fade-in">
          {/* Score banner */}
          <div className="card" style={{ padding: '24px 28px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, borderTop: `4px solid ${getColor(result.matchScore)}` }}>
            <div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 4 }}>Match Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 48, fontWeight: 800, color: getColor(result.matchScore) }}>
                  {result.matchScore}%
                </span>
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 19, fontWeight: 650, color: 'var(--ink)' }}>{getLabel(result.matchScore)}</span>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: 300, minWidth: 200 }}>
              <div style={{ background: '#eef1f6', borderRadius: 99, height: 14, overflow: 'hidden' }}>
                <div style={{ width: `${result.matchScore}%`, background: getColor(result.matchScore), height: '100%', borderRadius: 99, transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          </div>

          <div className="jd-grid3" style={{ marginBottom: 24 }}>
            <div className="card card-pad" style={{ borderTop: '4px solid #16a34a' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--green)', fontFamily: 'Geist, sans-serif' }}>
                Matched Skills <span className="pill green">{result.matchedSkills?.length || 0}</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.matchedSkills?.map((skill, i) => (
                  <span key={i} className="pill green">✓ {skill}</span>
                ))}
              </div>
            </div>

            <div className="card card-pad" style={{ borderTop: '4px solid #dc2626' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--red)', fontFamily: 'Geist, sans-serif' }}>
                Missing Skills <span className="pill red">{result.missingSkills?.length || 0}</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.missingSkills?.map((skill, i) => (
                  <span key={i} className="pill red">✗ {skill}</span>
                ))}
              </div>
            </div>

            <div className="card card-pad" style={{ borderTop: '4px solid var(--brand)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--brand)', fontFamily: 'Geist, sans-serif' }}>
                💡 Suggestions
              </h3>
              {result.suggestions?.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 13.5, color: 'var(--body)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--brand)', flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => { setResult(null); setResumeFile(null); setJobDescription(''); }}>
              <span className="material-symbols-outlined">refresh</span>
              Analyze Again
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/ats-checker')}>
              <span className="material-symbols-outlined">shield</span>
              ATS Checker
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
