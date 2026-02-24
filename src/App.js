import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './LoginPage';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// ─────────────────────────────────────────────────────────
// Auth helpers
// ─────────────────────────────────────────────────────────
function clearSession() {
  ['accessToken', 'refreshToken', 'isStaff', 'userProfile'].forEach(k =>
    localStorage.removeItem(k)
  );
}

function restoreSession() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    const raw     = localStorage.getItem('userProfile');
    const profile = raw ? JSON.parse(raw) : {};
    const isStaff = localStorage.getItem('isStaff') === 'true';
    return { token, profile, isStaff };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// App — entry point
// ─────────────────────────────────────────────────────────
function App() {
  const [auth, setAuth]         = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const session = restoreSession();
    if (session) setAuth(session);
    setChecking(false);
  }, []);

  const handleLoginSuccess = ({ accessToken, profile, isStaff }) => {
    setAuth({ token: accessToken, profile, isStaff });
  };

  const handleLogout = () => {
    clearSession();
    setAuth(null);
  };

  if (checking) {
    return (
      <div style={{ minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:32, height:32, border:'3px solid #222', borderTopColor:'#3b82f6', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!auth) return <LoginPage onLoginSuccess={handleLoginSuccess} />;

  return <RegistrationPage token={auth.token} profile={auth.profile} onLogout={handleLogout} />;
}

export default App;


// ─────────────────────────────────────────────────────────
// RegistrationPage — same UI, now connected to real backend
// ─────────────────────────────────────────────────────────
function RegistrationPage({ token, profile, onLogout }) {

  // ── state ──
  const [availableCourses,   setAvailableCourses]   = useState([]);
  const [registeredCourses,  setRegisteredCourses]  = useState([]);
  const [loadingCourses,     setLoadingCourses]     = useState(true);
  const [selectedCourse,     setSelectedCourse]     = useState('');
  const [selectedCode,       setSelectedCode]       = useState('');
  const [selectedGroup,      setSelectedGroup]      = useState('');
  const [courseDetails,      setCourseDetails]      = useState(null);
  const [saving,             setSaving]             = useState(false);
  const [flashMsg,           setFlashMsg]           = useState(null); // {type, text}

  const headers = { Authorization: `Bearer ${token}` };

  // ── fetch all courses from backend on mount ──
  useEffect(() => {
    fetch(`${API}/courses`, { headers })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setAvailableCourses(data);
      })
      .catch(() => showFlash('error', 'Failed to load courses. Check your connection.'))
      .finally(() => setLoadingCourses(false));
  // eslint-disable-next-line
  }, []);

  // ── fetch already-enrolled courses on mount ──
  useEffect(() => {
    fetch(`${API}/courses/my-courses`, { headers })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // map backend shape → local shape so the table displays correctly
          const mapped = data.map(c => ({
            classId:    c.ClassId,
            code:       c.CourseCode,
            name:       c.ClassName,
            group:      c.GroupName  || '—',
            room:       '—',
            day:        '—',
            hour:       '—',
            credits:    0,
            creditCost: 0,
            amount:     0,
          }));
          setRegisteredCourses(mapped);
        }
      })
      .catch(() => {}); // silent — not critical
  // eslint-disable-next-line
  }, []);

  const showFlash = (type, text) => {
    setFlashMsg({ type, text });
    setTimeout(() => setFlashMsg(null), 4000);
  };

  // ── course selector ──
  const handleCourseChange = (e) => {
    const classId = Number(e.target.value);
    setSelectedCourse(classId || '');
    const course = availableCourses.find(c => c.ClassId === classId);
    if (course) {
      setSelectedCode(course.CourseCode || '');
      setCourseDetails(course);
      setSelectedGroup('');
    } else {
      setSelectedCode('');
      setCourseDetails(null);
      setSelectedGroup('');
    }
  };

  const handleGroupChange = (e) => setSelectedGroup(e.target.value);

  // ── Add a Course → saves to DB via backend ──
  const addCourse = async () => {
    if (!selectedCourse || !courseDetails) {
      alert('Please select a course.');
      return;
    }

    // check duplicate in local list
    if (registeredCourses.find(c => c.classId === courseDetails.ClassId)) {
      alert('This course is already registered.');
      return;
    }

    setSaving(true);
    try {
      const res  = await fetch(`${API}/courses/register-course`, {
        method:  'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ classId: courseDetails.ClassId }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Registration failed.');
        return;
      }

      // add to local registered list so table updates immediately
      const newCourse = {
        classId:    courseDetails.ClassId,
        code:       courseDetails.CourseCode || '',
        name:       courseDetails.ClassName  || '',
        group:      selectedGroup || courseDetails.GroupName || '—',
        room:       '—',
        day:        '—',
        hour:       '—',
        credits:    0,
        creditCost: 0,
        amount:     0,
      };
      setRegisteredCourses(prev => [...prev, newCourse]);
      showFlash('success', `"${courseDetails.ClassName}" registered! Group chat is now live in your app.`);

      // reset selectors
      setSelectedCourse('');
      setSelectedCode('');
      setSelectedGroup('');
      setCourseDetails(null);

    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Withdraw ──
  const withdrawCourse = (classId) => {
    if (window.confirm('Are you sure you want to withdraw this course?')) {
      setRegisteredCourses(prev => prev.filter(c => c.classId !== classId));
      // Note: backend withdraw (leave room) can be wired here if needed
    }
  };

  // ── totals ──
  const totalCredits    = registeredCourses.reduce((s, c) => s + c.credits, 0);
  const totalCreditCost = registeredCourses.reduce((s, c) => s + c.amount,  0);
  const regFee          = 25000;
  const grandTotal      = totalCreditCost + regFee;
  const formatCurrency  = (n) => new Intl.NumberFormat('en-RW').format(n);

  // real profile values
  const fullName   = profile ? `${profile.Fname || ''} ${profile.Lname || ''}`.trim() : '—';
  const regNr      = profile?.StudentId  || profile?.Id || '—';
  const faculty    = profile?.Faculty    || '—';
  const department = profile?.Department || '—';

  return (
    <div className="app-container">
      <div className="content-wrapper">

        {/* logout */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
          <button onClick={onLogout} style={{ background:'#1a1a1a', border:'1px solid #333', color:'#9ca3af', borderRadius:6, padding:'7px 18px', fontSize:13, cursor:'pointer' }}>
            Logout
          </button>
        </div>

        {/* flash message */}
        {flashMsg && (
          <div style={{
            background: flashMsg.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${flashMsg.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: flashMsg.type === 'success' ? '#4ade80' : '#f87171',
            borderRadius: 8, padding:'12px 16px', marginBottom:16, fontSize:13,
          }}>
            {flashMsg.text}
          </div>
        )}

        {/* Student Info Header */}
        <div className="header-card">
          <h1 className="page-title">Student Registration - Semester 2025/I</h1>
          <div className="student-info">
            <div className="info-item">
              <span className="info-label">Full name:</span>
              <span className="info-value">{fullName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Reg. Nr.:</span>
              <span className="info-value">{regNr}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Faculty:</span>
              <span className="info-value">{faculty}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department:</span>
              <span className="info-value">{department}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Program:</span>
              <span className="info-value">Day</span>
            </div>
            <div className="info-item">
              <span className="info-label">Credits:</span>
              <span className="info-value">{totalCredits}</span>
            </div>
          </div>
        </div>

        {/* Course Selection */}
        <div className="section-card">
          <h2 className="section-title">Course</h2>

          {loadingCourses ? (
            <p style={{ color:'#9ca3af', fontSize:14 }}>Loading courses from server…</p>
          ) : (
            <div className="course-selection">
              <div className="form-row">
                <div className="form-group">
                  <label>Select course</label>
                  <select value={selectedCourse} onChange={handleCourseChange} className="form-select">
                    <option value="">Choose a course</option>
                    {availableCourses.map((course) => (
                      <option key={course.ClassId} value={course.ClassId}>
                        {course.ClassName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Code</label>
                  <input type="text" value={selectedCode} readOnly className="form-input" />
                </div>

                <div className="form-group">
                  <label>Group</label>
                  <input type="text" value={courseDetails?.GroupName || ''} readOnly className="form-input" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Semester</label>
                  <input type="text" value={courseDetails?.Semester || ''} readOnly className="form-input" />
                </div>
                <div className="form-group">
                  <label>Academic Year</label>
                  <input type="text" value={courseDetails?.AcademicYear || ''} readOnly className="form-input" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <input type="text" value={courseDetails?.ClassStatus || ''} readOnly className="form-input" />
                </div>
              </div>

              <div className="button-group">
                <button className="btn btn-primary" onClick={addCourse} disabled={saving}>
                  {saving ? 'Saving…' : 'Add a Course'}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (selectedCourse) withdrawCourse(Number(selectedCourse));
                    else alert('Please select a course to withdraw');
                  }}
                >
                  Withdraw Course
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fees Summary + Registered Courses */}
        {registeredCourses.length > 0 && (
          <>
            <div className="section-card">
              <h2 className="section-title">Fees summary</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>COURSE</th>
                      <th>CREDITS</th>
                      <th>CREDIT COST</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredCourses.map((course, i) => (
                      <tr key={i}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{formatCurrency(course.creditCost)}</td>
                        <td>{formatCurrency(course.amount)}</td>
                      </tr>
                    ))}
                    <tr className="fees-row">
                      <td colSpan="2">Reg. Fee: {formatCurrency(regFee)}.00 RWF</td>
                      <td colSpan="2">Life Assurance Fee: 0.00 RWF</td>
                      <td className="grand-total">Total: {formatCurrency(grandTotal)}.00 RWF</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="section-card">
              <h2 className="section-title">Registered courses</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>COURSE</th>
                      <th>GROUP</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredCourses.map((course, i) => (
                      <tr key={i}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.group}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => withdrawCourse(course.classId)}>
                            Withdraw
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}