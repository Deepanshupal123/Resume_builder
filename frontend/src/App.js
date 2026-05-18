import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeForm from './pages/ResumeForm';
import Builder from './pages/Builder';
import CoverLetter from './pages/CoverLetter';

// Protected route — login nahi hai toh landing pe bhejo
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