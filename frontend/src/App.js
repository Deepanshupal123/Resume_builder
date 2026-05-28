import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage  from './pages/LandingPage';
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Dashboard    from './pages/Dashboard';
import ResumeForm   from './pages/ResumeForm';
import Builder      from './pages/Builder';
import CoverLetter  from './pages/CoverLetter';
import ATSChecker   from './pages/ATSChecker';
import JDMatch      from './pages/JDMatch';
import Pricing      from './pages/Pricing';
import MyResumes    from './pages/MyResumes';
import Templates    from './pages/Templates';
import Analysis     from './pages/Analysis';
import Settings     from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// ✅ checks both 'user' and 'token' keys
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('user') || localStorage.getItem('token');
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected */}
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/resume"      element={<ProtectedRoute><ResumeForm /></ProtectedRoute>} />
        <Route path="/builder"     element={<ProtectedRoute><Builder /></ProtectedRoute>} />
        <Route path="/cover-letter"element={<ProtectedRoute><CoverLetter /></ProtectedRoute>} />
        <Route path="/ats-checker" element={<ProtectedRoute><ATSChecker /></ProtectedRoute>} />
        <Route path="/jd-match"    element={<ProtectedRoute><JDMatch /></ProtectedRoute>} />
        <Route path="/resumes"     element={<ProtectedRoute><MyResumes /></ProtectedRoute>} />
        <Route path="/templates"   element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/analysis"    element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
        <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
