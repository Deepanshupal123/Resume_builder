import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ATSChecker() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => { localStorage.clear(); window.location.href = '/'; };

  const handleCheck = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Resume aur Job Description dono bharo!');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('https://resume-builder-7ngc.onrender.com/api/ai/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent ✅';
    if (score >= 60) return 'Good 🟡';
    return 'Needs Work ❌';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="font-semibold text-gray-800">ResumeAI — ATS Checker</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, {user.name || 'User'} 👋</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ATS Score Checker 🎯</h1>
          <p className="text-gray-500">Resume paste karo + Job Description paste karo → AI score dega</p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">📄 Your Resume</h2>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Apna resume text yahan paste karo... (CV ka sara content copy karke yahan lagao)"
              rows={14}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">💡 Resume builder se text copy karo ya PDF se paste karo</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">💼 Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Job description yahan paste karo... (Naukri/LinkedIn se copy karo)"
              rows={14}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">💡 Naukri.com ya LinkedIn se JD copy karo</p>
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl text-base font-semibold hover:opacity-90 disabled:opacity-60 transition mb-10"
        >
          {loading ? '⏳ Analyzing Resume...' : '🎯 Check ATS Score'}
        </button>

        {/* Result Section */}
        {result && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div style={{
                width: '140px', height: '140px', borderRadius: '50%',
                border: `8px solid ${getScoreColor(result.score)}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: getScoreColor(result.score) }}>
                  {result.score}
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>/ 100</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{getScoreLabel(result.score)}</h2>
              <p className="text-gray-500 text-sm">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  ✅ Matched Keywords ({result.matchedKeywords?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                  {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
                    <p className="text-gray-400 text-sm">Koi match nahi mila</p>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  ❌ Missing Keywords ({result.missingKeywords?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                  {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                    <p className="text-gray-400 text-sm">Sab keywords match ho gaye! 🎉</p>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">💡 Improvements</h3>
              <div className="space-y-3">
                {result.suggestions?.map((s, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-500 font-bold text-sm mt-0.5">{i + 1}.</span>
                    <p className="text-sm text-gray-700">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Scores */}
            {result.sectionScores && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">📊 Section Analysis</h3>
                <div className="space-y-3">
                  {Object.entries(result.sectionScores).map(([section, score]) => (
                    <div key={section}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 capitalize">{section}</span>
                        <span className="font-semibold" style={{ color: getScoreColor(score) }}>{score}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${score}%`, background: getScoreColor(score) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/builder')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                ✏️ Resume Improve Karo
              </button>
              <button
                onClick={() => { setResult(null); setResumeText(''); setJobDescription(''); }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
              >
                🔄 Dobara Check Karo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
