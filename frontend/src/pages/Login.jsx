import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://resume-builder-7ngc.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const redirectTo = location.state && location.state.from ? location.state.from : '/dashboard';
      const after = location.state && location.state.after ? location.state.after : undefined;
      navigate(redirectTo, { state: after ? { after } : {} });
    } catch (err) {
      alert('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://resume-builder-7ngc.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert('Signup successful! Please login to continue.');
      setIsSignup(false);
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
    } catch (err) {
      alert('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      console.log('Google login initiated');
      alert('Google login integration - replace with actual OAuth implementation');
    } catch (err) {
      alert('Failed to login with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-['Inter'] flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        {/* Brand Section (Left Side - Desktop) */}
        <section className="hidden md:flex md:w-1/2 bg-[#000000] items-center justify-center p-[64px] relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <h1 className="font-['Source_Serif_4'] text-[32px] leading-[40px] font-semibold text-white mb-6">
              Executive Slate
            </h1>
            <blockquote className="mb-12">
              <p className="font-['Source_Serif_4'] text-[24px] leading-[32px] font-semibold text-white italic font-normal leading-relaxed opacity-90">
                "Build your authority."
              </p>
              <footer className="mt-4 text-[#64748B] text-[12px] leading-[16px] tracking-[0.05em] font-semibold uppercase">
                The Professional Standard
              </footer>
            </blockquote>
            <div className="bg-white/5 p-[24px] border border-white/10 rounded-lg">
              <p className="text-[14px] leading-[20px] font-normal text-white/70 italic">
                "The minimalist design and structural clarity of Executive Slate allowed me to present my career history with an authority I hadn't achieved before. It's truly a cut above."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#64748B] rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-white uppercase">
                    Julian Draxler
                  </p>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-tighter">
                    SVP Operations, Fintech Global
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Subtle atmospheric texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 50%)' }}></div>
          </div>
        </section>

        {/* Login/Signup Form Section */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-[16px] md:p-[64px] bg-[#f7f9fb]">
          <div className="w-full max-w-[400px]">
            {/* Mobile Branding */}
            <div className="md:hidden mb-12 text-center">
              <h1 className="font-['Source_Serif_4'] text-[28px] leading-[36px] font-semibold text-[#000000] mb-2">
                Executive Slate
              </h1>
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#64748B] uppercase">
                Build your authority.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-['Source_Serif_4'] text-[24px] leading-[32px] font-semibold text-[#000000] mb-2">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-[14px] leading-[20px] font-normal text-[#45464d]">
                {isSignup
                  ? 'Join Executive Slate and build your professional presence.'
                  : 'Access your executive workspace and resumes.'}
              </p>
            </div>

            <form className="space-y-6" onSubmit={isSignup ? handleSignup : handleLogin}>
              {isSignup && (
                <div className="space-y-2">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#000000] uppercase" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-white border border-[#000000] rounded-none text-[14px] leading-[20px] font-normal text-[#191c1e] focus:outline-none focus:border-[#000000]"
                    id="name"
                    placeholder="e.g., Stephen King"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#000000] uppercase" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 bg-white border border-[#000000] rounded-none text-[14px] leading-[20px] font-normal text-[#191c1e] focus:outline-none focus:border-[#000000]"
                  id="email"
                  placeholder="e.g., stephen.king@executive.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#000000] uppercase" htmlFor="password">
                    Password
                  </label>
                  {!isSignup && (
                    <a className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#64748B] hover:text-[#000000] transition-colors uppercase decoration-[#64748B] underline-offset-4 hover:underline" href="#">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 bg-white border border-[#000000] rounded-none text-[14px] leading-[20px] font-normal text-[#191c1e] focus:outline-none focus:border-[#000000] pr-12"
                    id="password"
                    placeholder={isSignup ? "Min 6 characters" : "••••••••"}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748B] hover:text-[#000000] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#000000] text-white py-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold uppercase hover:bg-[#64748B] transition-all duration-300 active:scale-[0.98] disabled:opacity-60"
              >
                {loading
                  ? (isSignup ? 'Creating Account...' : 'Logging in...')
                  : (isSignup ? 'Create Account' : 'Login')}
              </button>
            </form>

            {!isSignup && (
              <>
                <div className="relative my-10 flex items-center">
                  <div className="flex-grow border-t border-[#E2E8F0]"></div>
                  <span className="px-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#64748B] uppercase">
                    or continue with
                  </span>
                  <div className="flex-grow border-t border-[#E2E8F0]"></div>
                </div>

                <div className="grid grid-cols-1 gap-[24px]">
                 <GoogleLogin
  onSuccess={async (credentialResponse) => {

    try {

      setGoogleLoading(true);

      const res = await fetch(
        'https://resume-builder-7ngc.onrender.com/api/auth/google',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const redirectTo =
        location.state && location.state.from
          ? location.state.from
          : '/dashboard';

      navigate(redirectTo);

    } catch (err) {

      console.log(err);
      alert('Google Login Failed');

    } finally {

      setGoogleLoading(false);

    }
  }}

  onError={() => {
    alert('Google Login Failed');
  }}
/>
                </div>
              </>
            )}

            <p className="mt-12 text-center text-[14px] leading-[20px] font-normal text-[#45464d]">
              {isSignup ? 'Already have an account?' : 'New to Executive Slate?'}
              {' '}
              <button
                onClick={toggleMode}
                className="text-[#000000] font-bold hover:underline decoration-[#000000] underline-offset-4"
              >
                {isSignup ? 'Login' : 'Create an Account'}
              </button>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f7f9fb] py-[8px] px-[64px] border-t border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
          <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#45464d] uppercase tracking-tighter">
            © 2024 Executive Slate. All rights reserved.
          </p>
          <div className="flex gap-[24px]">
            <a className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#45464d] hover:text-[#000000] uppercase" href="#">
              Privacy Policy
            </a>
            <a className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#45464d] hover:text-[#000000] uppercase" href="#">
              Terms of Service
            </a>
            <a className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#45464d] hover:text-[#000000] uppercase" href="#">
              Help Center
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}