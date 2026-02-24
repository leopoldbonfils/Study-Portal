import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function LoginPage({ onLoginSuccess }) {
  const [isStaff,  setIsStaff]  = useState(false);
  const [id,       setId]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!id || !password) {
      setError('Please enter your ID / Email and Password.');
      return;
    }
    setError('');
    setLoading(true);

    const payload = {
      Id:       isStaff ? id : Number(id),
      Password: password,
      isStaff,
    };

    try {
      const res  = await fetch(`${API}/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(typeof data === 'string' ? data : data.message || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      // save to localStorage
      localStorage.setItem('accessToken',  data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('isStaff',      String(isStaff));

      const profile = isStaff
        ? (data.staffProfile?.[0]   ?? data.staffProfile)
        : (data.studentProfile?.[0] ?? data.studentProfile);

      if (profile) localStorage.setItem('userProfile', JSON.stringify(profile));

      onLoginSuccess({ accessToken: data.accessToken, profile, isStaff });

    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => e.key === 'Enter' && handleLogin();

  return (
    <>
      <style>{css}</style>
      <div className="lp-page">
        <div className="lp-bg" aria-hidden="true" />

        <div className="lp-card">

          {/* logo */}
          <div className="lp-logo">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <rect width="50" height="50" rx="14" fill="url(#lpg)" />
              <path d="M11 35L25 12L39 35H30L25 22L20 35Z" fill="white" opacity=".92"/>
              <rect x="10" y="35" width="30" height="3.5" rx="1.75" fill="white" opacity=".4"/>
              <defs>
                <linearGradient id="lpg" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e4db7"/>
                  <stop offset="1" stopColor="#0a2472"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="lp-title">Welcome Back</h1>
          <p className="lp-sub">Please log in to continue</p>

          {/* toggle */}
          <div className="lp-toggle">
            <button className={`lp-tab${!isStaff ? ' lp-tab-active' : ''}`}
              onClick={() => { setIsStaff(false); setError(''); }}>
              Student
            </button>
            <button className={`lp-tab${isStaff ? ' lp-tab-active' : ''}`}
              onClick={() => { setIsStaff(true); setError(''); }}>
              Staff / Lecturer
            </button>
          </div>

          {/* ID / Email */}
          <div className="lp-field">
            <span className="lp-icon">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input className="lp-input"
              type={isStaff ? 'email' : 'number'}
              placeholder={isStaff ? 'Email Address' : 'Student ID'}
              value={id}
              onChange={e => { setId(e.target.value); setError(''); }}
              onKeyDown={onKey}
            />
          </div>

          {/* Password */}
          <div className="lp-field">
            <span className="lp-icon">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </span>
            <input className="lp-input"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={onKey}
            />
            <button className="lp-eye" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
              {showPass
                ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>

          {/* forgot */}
          <div className="lp-forgot-row">
            <button className="lp-forgot"
              onClick={() => alert('Contact your administrator to reset your password.')}>
              Forgot password?
            </button>
          </div>

          {/* error */}
          {error && <div className="lp-error">{error}</div>}

          {/* login button */}
          <button className="lp-btn" onClick={handleLogin} disabled={loading}>
            {loading ? <span className="lp-spinner" /> : 'Login'}
          </button>

        </div>
      </div>
    </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

.lp-page {
  min-height: 100vh;
  background: #060f2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
  position: relative;
  overflow: hidden;
  padding: 20px;
}
.lp-bg {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 22% 28%, rgba(30,77,183,0.2) 0%, transparent 50%),
    radial-gradient(circle at 78% 72%, rgba(10,36,114,0.22) 0%, transparent 50%),
    radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: auto, auto, 30px 30px;
  pointer-events: none;
}
.lp-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 26px;
  padding: 46px 42px 42px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 32px 80px rgba(0,0,12,0.6);
  position: relative;
  z-index: 1;
}
.lp-logo { display: flex; justify-content: center; margin-bottom: 22px; }
.lp-title {
  font-size: 26px; font-weight: 700; color: #f0f4ff;
  text-align: center; margin: 0 0 6px; letter-spacing: -0.3px;
}
.lp-sub { font-size: 13.5px; color: #5a6e9e; text-align: center; margin: 0 0 28px; }

.lp-toggle {
  display: flex;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 22px;
  gap: 4px;
}
.lp-tab {
  flex: 1; padding: 9px 0; border: none; border-radius: 9px;
  background: transparent; color: #5a6e9e;
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all .2s;
}
.lp-tab-active {
  background: linear-gradient(135deg, #1e4db7, #0a2472);
  color: #fff;
  box-shadow: 0 2px 12px rgba(30,77,183,0.45);
}

.lp-field { position: relative; margin-bottom: 14px; }
.lp-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: #3d5080; display: flex; align-items: center; pointer-events: none;
}
.lp-input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 13px 44px 13px 40px;
  color: #e8eeff;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color .2s, background .2s;
}
.lp-input::placeholder { color: #2e3f66; }
.lp-input:focus {
  border-color: rgba(79,126,255,0.5);
  background: rgba(79,126,255,0.06);
}
.lp-input[type=number]::-webkit-outer-spin-button,
.lp-input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
.lp-input[type=number] { -moz-appearance: textfield; }

.lp-eye {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #3d5080;
  display: flex; align-items: center; padding: 4px; transition: color .2s;
}
.lp-eye:hover { color: #a0b4ff; }

.lp-forgot-row { text-align: right; margin: -4px 0 20px; }
.lp-forgot {
  background: none; border: none; color: #4f7eff;
  font-family: 'Sora', sans-serif; font-size: 12.5px; cursor: pointer; padding: 0;
}
.lp-forgot:hover { color: #a0b4ff; }

.lp-error {
  background: rgba(239,68,68,0.11);
  border: 1px solid rgba(239,68,68,0.22);
  color: #f87171; border-radius: 10px;
  padding: 10px 14px; font-size: 13px;
  text-align: center; margin-bottom: 16px; line-height: 1.5;
}

.lp-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #1e4db7, #0a2472);
  color: #fff; border: none; border-radius: 13px;
  font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600;
  cursor: pointer; letter-spacing: 0.3px;
  box-shadow: 0 6px 24px rgba(10,36,115,0.5);
  transition: opacity .2s, transform .15s;
  display: flex; align-items: center; justify-content: center; min-height: 50px;
}
.lp-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
.lp-btn:disabled { opacity: .5; cursor: not-allowed; }

.lp-spinner {
  width: 20px; height: 20px;
  border: 2.5px solid rgba(255,255,255,0.2);
  border-top-color: #fff; border-radius: 50%;
  animation: lp-spin .7s linear infinite; display: inline-block;
}
@keyframes lp-spin { to { transform: rotate(360deg); } }

@media (max-width: 480px) {
  .lp-card { padding: 32px 22px 28px; }
  .lp-title { font-size: 22px; }
}
`;