import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function CourseRegistrationPage({ token, profile, onLogout }) {
  const [courses,    setCourses]    = useState([]);
  const [enrolled,   setEnrolled]   = useState([]); // array of ClassIds
  const [loading,    setLoading]    = useState(true);
  const [working,    setWorking]    = useState(null); // classId being registered
  const [flash,      setFlash]      = useState(null); // { type, text }

 

  // small fix for variable typo above
  const fetchEnrolled = async () => {
    try {
      const res  = await fetch(`${API}/courses/my-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEnrolled(Array.isArray(data) ? data.map(c => c.ClassId) : []);
    } catch { /* silent */ }
  };

  const fetchAll = async () => {
    try {
      const res  = await fetch(`${API}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setFlash({ type: 'error', text: 'Failed to load courses. Please refresh.' });
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAll(), fetchEnrolled()]).finally(() => setLoading(false));
  // eslint-disable-next-line
  }, []);

  /* ── register for a course ── */
  const handleRegister = async (classId, name) => {
    setWorking(classId);
    setFlash(null);
    try {
      const res  = await fetch(`${API}/courses/register-course`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify({ classId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFlash({ type: 'error', text: data.error || 'Registration failed.' });
      } else {
        setEnrolled(prev => [...prev, classId]);
        setFlash({ type: 'success', text: `Registered for "${name}". The group chat is now live in your app!` });
      }
    } catch {
      setFlash({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setWorking(null);
    }
  };

  const available = courses.filter(c => !enrolled.includes(c.ClassId));
  const myList    = courses.filter(c =>  enrolled.includes(c.ClassId));

  return (
    <>
      <style>{css}</style>

      <div className="cr-page">
        <div className="cr-bg" aria-hidden="true" />

        {/* header */}
        <header className="cr-header">
          <div className="cr-header-left">
            <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="10" fill="url(#hg)"/>
              <path d="M9 31L22 11L35 31H27L22 19L17 31Z" fill="white" opacity=".92"/>
              <rect x="8" y="31" width="28" height="3" rx="1.5" fill="white" opacity=".5"/>
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e4db7"/>
                  <stop offset="1" stopColor="#0a2472"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="cr-header-title">Course Registration</span>
          </div>
          <div className="cr-header-right">
            {profile && (
              <span className="cr-user">
                {profile.Fname} {profile.Lname}
              </span>
            )}
            <button className="cr-logout" onClick={onLogout}>Logout</button>
          </div>
        </header>

        <main className="cr-main">
          {/* welcome */}
          <div className="cr-welcome">
            <div className="cr-welcome-text">
              <h2>Hello, {profile?.Fname || 'Student'} 👋</h2>
              <p>Register for your courses below. Once registered, the group chat for that course will automatically appear in your mobile app.</p>
            </div>
            <div className="cr-stats">
              <div className="cr-stat">
                <span className="cr-stat-num">{myList.length}</span>
                <span className="cr-stat-label">Enrolled</span>
              </div>
              <div className="cr-stat-divider" />
              <div className="cr-stat">
                <span className="cr-stat-num">{available.length}</span>
                <span className="cr-stat-label">Available</span>
              </div>
            </div>
          </div>

          {/* flash message */}
          {flash && (
            <div className={`cr-flash cr-flash-${flash.type}`}>
              {flash.type === 'success'
                ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
              {flash.text}
            </div>
          )}

          {loading ? (
            <div className="cr-loading">
              <div className="cr-spin" />
              <span>Loading courses…</span>
            </div>
          ) : (
            <>
              {/* enrolled courses */}
              {myList.length > 0 && (
                <section>
                  <h3 className="cr-section-title">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Your Enrolled Courses
                    <span className="cr-badge">{myList.length}</span>
                  </h3>
                  <div className="cr-grid">
                    {myList.map(c => (
                      <CourseCard key={c.ClassId} course={c} enrolled />
                    ))}
                  </div>
                </section>
              )}

              {/* available courses */}
              <section>
                <h3 className="cr-section-title">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                  Available Courses
                  <span className="cr-badge">{available.length}</span>
                </h3>

                {available.length === 0 ? (
                  <div className="cr-empty">
                    🎉 You are enrolled in all available courses!
                  </div>
                ) : (
                  <div className="cr-grid">
                    {available.map(c => (
                      <CourseCard
                        key={c.ClassId}
                        course={c}
                        enrolled={false}
                        onRegister={handleRegister}
                        working={working === c.ClassId}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}

/* ── individual card ── */
function CourseCard({ course, enrolled, onRegister, working }) {
  const name = course.ClassName || course.CourseName || '—';
  return (
    <div className={`cr-card${enrolled ? ' cr-card-enrolled' : ''}`}>
      <div className="cr-card-top">
        <span className="cr-code">{course.CourseCode || 'N/A'}</span>
        {enrolled && <span className="cr-enrolled-tag">✓ Enrolled</span>}
      </div>
      <h4 className="cr-course-name">{name}</h4>
      <p className="cr-group">{course.GroupName || ''}</p>
      <div className="cr-meta">
        {course.Semester   && <span>Semester {course.Semester}</span>}
        {course.AcademicYear && <span>{course.AcademicYear}</span>}
      </div>
      {!enrolled && (
        <button
          className="cr-reg-btn"
          onClick={() => onRegister(course.ClassId, name)}
          disabled={working}
        >
          {working
            ? <><span className="cr-spin-sm" /> Registering…</>
            : 'Register'}
        </button>
      )}
    </div>
  );
}

/* ─── CSS ─── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

.cr-page {
  min-height: 100vh;
  background: #060f2a;
  font-family: 'Sora', sans-serif;
  color: #e8eeff;
  position: relative;
}

.cr-bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 10% 20%,  rgba(30,77,183,0.14) 0%, transparent 45%),
    radial-gradient(circle at 90% 80%,  rgba(10,36,114,0.18) 0%, transparent 45%),
    radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: auto, auto, 32px 32px;
  pointer-events: none;
  z-index: 0;
}

/* header */
.cr-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 32px;
  background: rgba(6,15,42,0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.cr-header-left { display: flex; align-items: center; gap: 12px; }
.cr-header-title { font-size: 17px; font-weight: 600; color: #e8eeff; }
.cr-header-right { display: flex; align-items: center; gap: 16px; }
.cr-user { font-size: 13px; color: #6b82b8; }
.cr-logout {
  background: transparent;
  border: 1.5px solid rgba(100,140,255,0.25);
  color: #a0b4ff;
  border-radius: 8px;
  padding: 7px 16px;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: border-color .2s, color .2s;
}
.cr-logout:hover { border-color: #4f7eff; color: #fff; }

/* main */
.cr-main {
  max-width: 980px;
  margin: 0 auto;
  padding: 36px 24px 60px;
  position: relative;
  z-index: 1;
}

/* welcome banner */
.cr-welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: rgba(30,77,183,0.12);
  border: 1px solid rgba(79,126,255,0.18);
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.cr-welcome-text h2 { font-size: 22px; font-weight: 700; margin: 0 0 6px; }
.cr-welcome-text p  { margin: 0; color: #6b82b8; font-size: 13.5px; line-height: 1.6; max-width: 520px; }
.cr-stats { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
.cr-stat { text-align: center; }
.cr-stat-num   { display: block; font-size: 28px; font-weight: 700; color: #4f7eff; }
.cr-stat-label { display: block; font-size: 11px; color: #6b82b8; text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; }
.cr-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

/* flash */
.cr-flash {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  padding: 13px 18px;
  font-size: 13.5px;
  margin-bottom: 24px;
  line-height: 1.5;
}
.cr-flash-success {
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.25);
  color: #4ade80;
}
.cr-flash-error {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  color: #f87171;
}

/* loading */
.cr-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 0;
  color: #6b82b8;
  font-size: 14px;
}

/* section title */
.cr-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #a0b4ff;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.cr-badge {
  margin-left: auto;
  background: rgba(79,126,255,0.15);
  color: #4f7eff;
  border-radius: 50px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
}

/* grid */
.cr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 36px;
}

/* card */
.cr-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color .2s, transform .2s;
}
.cr-card:hover { border-color: rgba(79,126,255,0.3); transform: translateY(-2px); }
.cr-card-enrolled { border-color: rgba(79,126,255,0.2); opacity: .8; }
.cr-card-enrolled:hover { transform: none; }

.cr-card-top { display: flex; justify-content: space-between; align-items: center; }
.cr-code {
  background: rgba(79,126,255,0.12);
  color: #4f7eff;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .05em;
}
.cr-enrolled-tag {
  background: rgba(34,197,94,0.1);
  color: #4ade80;
  border-radius: 6px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 600;
}
.cr-course-name { margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #e8eeff; line-height: 1.4; }
.cr-group { margin: 0; font-size: 12px; color: #4a5e8a; }
.cr-meta { display: flex; gap: 10px; font-size: 11px; color: #4a5e8a; margin-top: 4px; }

.cr-reg-btn {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #1e4db7, #0a2472);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  box-shadow: 0 4px 14px rgba(14,36,115,0.35);
  transition: opacity .2s;
}
.cr-reg-btn:hover:not(:disabled) { opacity: .85; }
.cr-reg-btn:disabled { opacity: .55; cursor: not-allowed; }

/* empty state */
.cr-empty {
  text-align: center;
  color: #6b82b8;
  font-size: 14px;
  padding: 40px 0;
}

/* spinners */
.cr-spin {
  width: 34px; height: 34px;
  border: 3px solid rgba(79,126,255,0.15);
  border-top-color: #4f7eff;
  border-radius: 50%;
  animation: cr-spin .75s linear infinite;
}
.cr-spin-sm {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: cr-spin .75s linear infinite;
}
@keyframes cr-spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .cr-header { padding: 12px 16px; }
  .cr-main   { padding: 24px 16px 48px; }
  .cr-welcome { padding: 20px; }
  .cr-welcome-text h2 { font-size: 18px; }
  .cr-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 380px) {
  .cr-grid { grid-template-columns: 1fr; }
}
`;