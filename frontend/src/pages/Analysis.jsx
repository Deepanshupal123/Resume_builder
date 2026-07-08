import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

export default function Analysis() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // ─────────────────────────────────────────────
  // PDF TEXT EXTRACTOR
  // ─────────────────────────────────────────────
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

            const pdf = await pdfjsLib.getDocument({
              data: typedArray,
            }).promise;

            let text = '';

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();

              text +=
                content.items.map((s) => s.str).join(' ') + '\n';
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
        s.src =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

        s.onload = run;
        s.onerror = () =>
          reject(new Error('PDF.js load failed'));

        document.head.appendChild(s);
      }
    });
  }

  // ─────────────────────────────────────────────
  // FILE HANDLE
  // ─────────────────────────────────────────────
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

      setUploadedFile({
        name: file.name,
        type: ext,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // ─────────────────────────────────────────────
  // ANALYZE RESUME
  // ─────────────────────────────────────────────
  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please upload or paste resume');
      return;
    }

    setLoading(true);
    setResult(null);
    setError('');

    const messages = [
      'Sending to AI...',
      'Analyzing ATS...',
      'Checking keywords...',
      'Generating report...',
    ];

    let i = 0;

    setLoadingMsg(messages[0]);

    const interval = setInterval(() => {
      i = Math.min(i + 1, messages.length - 1);
      setLoadingMsg(messages[i]);
    }, 1500);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE}/api/ai/resume-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            resumeText,
          }),
        }
      );

      const data = await response.json();

if (data.error) {
  throw new Error(data.error);
}

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // SCORE HELPERS
  // ─────────────────────────────────────────────
  const getColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: 'white',
        padding: 30,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 30,
          }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>

          <h1
            style={{
              fontSize: 28,
              margin: 0,
            }}
          >
            AI Resume Analysis
          </h1>
        </div>

        {/* INPUT */}
        {!result && (
          <>
            {/* UPLOAD */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #334155',
                borderRadius: 16,
                padding: 40,
                textAlign: 'center',
                cursor: 'pointer',
                background: '#111827',
                marginBottom: 20,
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.txt"
                style={{ display: 'none' }}
                onChange={(e) =>
                  handleFile(e.target.files[0])
                }
              />

              {uploadedFile ? (
                <>
                  <div
                    style={{
                      fontSize: 40,
                    }}
                  >
                    ✅
                  </div>

                  <p>{uploadedFile.name}</p>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: 40,
                    }}
                  >
                    📄
                  </div>

                  <p>Upload Resume PDF or TXT</p>
                </>
              )}
            </div>

            {/* TEXTAREA */}
            <textarea
              value={resumeText}
              onChange={(e) =>
                setResumeText(e.target.value)
              }
              placeholder="Paste resume text..."
              style={{
                width: '100%',
                minHeight: 220,
                borderRadius: 16,
                border: '1px solid #334155',
                background: '#111827',
                color: 'white',
                padding: 20,
                fontSize: 14,
                marginBottom: 20,
                boxSizing: 'border-box',
              }}
            />

            {/* ERROR */}
            {error && (
              <div
                style={{
                  background: '#7f1d1d',
                  padding: 14,
                  borderRadius: 10,
                  marginBottom: 20,
                }}
              >
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={analyzeResume}
              disabled={loading}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 16,
                border: 'none',
                background:
                  'linear-gradient(135deg,#8b5cf6,#06b6d4)',
                color: 'white',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              {loading
                ? loadingMsg
                : 'Analyze Resume'}
            </button>
          </>
        )}

        {/* RESULT */}
        {result && (
          <div
            style={{
              display: 'grid',
              gap: 20,
            }}
          >
            {/* SCORE */}
            <div
              style={{
                background: '#111827',
                borderRadius: 20,
                padding: 30,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: '#94a3b8',
                  marginBottom: 10,
                }}
              >
                Overall Score
              </div>

              <div
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: getColor(result.overallScore),
                }}
              >
                {result.overallScore}%
              </div>

              <div
                style={{
                  marginTop: 20,
                  height: 12,
                  background: '#1e293b',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${result.overallScore}%`,
                    background: getColor(
                      result.overallScore
                    ),
                    height: '100%',
                  }}
                />
              </div>
            </div>

            {/* STRENGTHS */}
            <div
              style={{
                background: '#111827',
                borderRadius: 20,
                padding: 24,
              }}
            >
              <h2>✅ Strengths</h2>

              {result.strengths?.map((s, i) => (
                <div key={i}>{s}</div>
              ))}
            </div>

            {/* MISSING */}
            <div
              style={{
                background: '#111827',
                borderRadius: 20,
                padding: 24,
              }}
            >
              <h2>❌ Missing Keywords</h2>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                {result.missingKeywords?.map((k, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#7f1d1d',
                      padding: '6px 12px',
                      borderRadius: 999,
                    }}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* IMPROVEMENTS */}
            <div
              style={{
                background: '#111827',
                borderRadius: 20,
                padding: 24,
              }}
            >
              <h2>💡 Improvements</h2>

              {result.improvements?.map((i, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 14,
                  }}
                >
                  <strong>{i.title}</strong>

                  <p>{i.detail}</p>
                </div>
              ))}
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: 'flex',
                gap: 12,
              }}
            >
              <button
                onClick={() => {
                  setResult(null);
                  setResumeText('');
                  setUploadedFile(null);
                }}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  border: 'none',
                  background: '#334155',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Analyze Again
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  border: 'none',
                  background:
                    'linear-gradient(135deg,#8b5cf6,#06b6d4)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}