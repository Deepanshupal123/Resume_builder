import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeForm from './pages/ResumeForm';
import Builder from './pages/Builder';
import CoverLetter from './pages/CoverLetter';
import ATSChecker from './pages/ATSChecker';
import JDMatch from './pages/JDMatch';
import Pricing from './pages/Pricing';
// Protected route — if not logged in, redirect to landing
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('token');
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/ats-checker" element={<ATSChecker />} />
        <Route path="/jd-match" element={<JDMatch />} />
        <Route path="/pricing" element={<Pricing />} />
        

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/resume" element={
          <ProtectedRoute><ResumeForm /></ProtectedRoute>
        } />
        <Route path="/builder" element={
          <ProtectedRoute><Builder /></ProtectedRoute>
        } />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;