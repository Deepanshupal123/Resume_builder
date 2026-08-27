import { useState, useRef } from 'react';
import { API_BASE } from '../utils/api';
import AppShell from '../components/AppShell';

export default function Analysis() {
  const fileInputRef = useRef(null);

  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // ── PDF text extractor (pdf.js via CDN) ──
  async function extractPdfText(file) {
    return new Promise((resolve, reject) => {
      const script = document.getElementById('pdfjs-script');

      const run = () => {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const typedArray = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map((s) => s.str).join(' ') + '\n';
            }
            resolve(text);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      };

      if (window['pdfjs-dist/build/pdf']) {
        run();
        return;
      }

      if (!script) {
        const s = document.createElement('script');
        s.id = 'pdfjs-script';
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        s.onload = run;
        s.onerror = () => reject(new Error('PDF.js load failed'));
        document.head.appendChild(s);
      }
    });
  }

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) {
      setError('Only PDF or TXT files supported');
      return;
    }
    try {
      setError('');
      let text = '';
      if (ext === 'pdf') {
        text = await extractPdfText(file);
      } else {
        text = await file.text();
      }
      setResumeText(text);
      setUploadedFile({ name: file.name, type: ext });
    } catch (err) {
      setError(err.message);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please upload or paste resume');
      return;
    }

    setLoading(true);
    setResult(null);
    setError('');

    const messages = ['Sending to AI…', 'Analyzing ATS…', 'Checking keywords…', 'Generating report…'];
    let i = 0;
    setLoadingMsg(messages[0]);
    const interval = setInterval(() => {
      i = Math.min(i + 1, messages.length - 1);
      setLoadingMsg(messages[i]);
    }, 1500);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/ai/resume-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ resumeText }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const getColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#d97706';
    if (score >= 40) return '#ea580c';
    return '#dc2626';
  };

  return (
    <AppShell active="analysis" title="AI Resume Analysis" subtitle="Deep, expert-level feedback on your resume content">
      <style>{`
        .an-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 860px) { .an-grid { grid-template-columns: 1fr; } }
      `}</style>

      {!result && (
        <>
          <div className="an-grid" style={{ marginBottom: 20 }}>
            <div className="card card-pad">
              <label className="label" style={{ marginBottom: 10 }}>Upload Resume (PDF / TXT)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${uploadedFile ? '#16a34a' : 'var(--line-strong)'}`,
                  borderRadius: 14,
                  padding: '48px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: uploadedFile ? 'var(--green-soft)' : '#fafbfd',
                  transition: 'all 0.2s',
                }}
              >
                <input type="file" ref={fileInputRef} accept=".pdf,.txt" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
                {uploadedFile ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 38, color: '#16a34a' }}>task_alt</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)', marginTop: 8 }}>{uploadedFile.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Text extracted — click to change</div>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 38, color: 'var(--brand)' }}>upload_file</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>Upload resume PDF or TXT</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>We extract the text automatically</div>
                  </>
                )}
              </div>
            </div>

            <div className="card card-pad">
              <label className="label" style={{ marginBottom: 10 }}>Or paste resume text</label>
              <textarea
                className="textarea"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here…"
                style={{ height: 190 }}
              />
            </div>
          </div>

          {error && (
            <div className="card" style={{ padding: '12px 16px', marginBottom: 18, background: 'var(--red-soft)', borderColor: '#fecdca', color: 'var(--red)', fontSize: 13.5 }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button type="button" className="btn btn-primary btn-lg" onClick={analyzeResume} disabled={loading}>
              {loading ? (
                <><span className="material-symbols-outlined spin">progress_activity</span>{loadingMsg}</>
              ) : (
                <><span className="material-symbols-outlined">psychology</span>Analyze Resume</>
              )}
            </button>
          </div>
        </>
      )}

      {result && (
        <div className="fade-in" style={{ display: 'grid', gap: 18 }}>
          {/* Overall score */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 8 }}>Overall Score</div>
            <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 56, fontWeight: 800, color: getColor(result.overallScore), lineHeight: 1 }}>
              {result.overallScore}%
            </div>
            <div style={{ marginTop: 18, height: 12, background: '#eef1f6', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${result.overallScore}%`, background: getColor(result.overallScore), height: '100%', transition: 'width 1s ease' }} />
            </div>
          </div>

          <div className="an-grid">
            <div className="card card-pad">
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--green)', fontFamily: 'Geist, sans-serif' }}>✅ Strengths</h3>
              {result.strengths?.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13.5, color: 'var(--body)' }}>
                  <span style={{ color: '#16a34a', flexShrink: 0 }}>✓</span> {s}
                </div>
              ))}
            </div>

            <div className="card card-pad">
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--red)', fontFamily: 'Geist, sans-serif' }}>❌ Missing Keywords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.missingKeywords?.map((k, i) => (
                  <span key={i} className="pill red">{k}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--brand)', fontFamily: 'Geist, sans-serif' }}>💡 Improvements</h3>
            {result.improvements?.map((imp, index) => (
              <div key={index} style={{ marginBottom: 14, paddingLeft: 14, borderLeft: '3px solid var(--brand-line)' }}>
                <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--ink)', marginBottom: 3 }}>{imp.title}</div>
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--body)', lineHeight: 1.6 }}>{imp.detail}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={() => { setResult(null); setResumeText(''); setUploadedFile(null); }}>
              <span className="material-symbols-outlined">refresh</span>
              Analyze Again
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
