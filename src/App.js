import React, { useState } from 'react';
import './App.css';

function App() {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);

  // Available courses to select from
  const availableCourses = [
    {
      name: 'Academic English Writing',
      code: 'ENGL 8124',
      groups: ['A', 'B'],
      schedules: {
        'A': { room: '201', day: 'MONDAY', hour: '14', maxGpe: 60, current: 45 },
        'B': { room: '202', day: 'TUESDAY', hour: '14', maxGpe: 60, current: 60 }
      },
      credits: 3,
      creditCost: 21407
    },
    {
      name: 'Introduction to Linux',
      code: 'COSC 8312',
      groups: ['A', 'B'],
      schedules: {
        'A': { room: 'G306', day: 'THURSDAY', hour: '10', maxGpe: 60, current: 52 },
        'B': { room: 'G307', day: 'MONDAY', hour: '18', maxGpe: 60, current: 60 }
      },
      credits: 3,
      creditCost: 21407
    },
    {
      name: 'Web Technology and Internet',
      code: 'INSY 8322',
      groups: ['D', 'E'],
      schedules: {
        'D': { room: 'G203', day: 'TUESDAY', hour: '18', maxGpe: 60, current: 48 },
        'E': { room: 'G204', day: 'WEDNESDAY', hour: '18', maxGpe: 60, current: 60 }
      },
      credits: 4,
      creditCost: 21407
    },
    {
      name: 'Dot Net',
      code: 'INSY 8411',
      groups: ['A', 'B'],
      schedules: {
        'A': { room: 'G205', day: 'THURSDAY', hour: '14', maxGpe: 60, current: 55 },
        'B': { room: 'G206', day: 'FRIDAY', hour: '14', maxGpe: 60, current: 50 }
      },
      credits: 4,
      creditCost: 21407
    },
    {
      name: 'Software Modeling Design',
      code: 'SENG 8323',
      groups: ['C', 'D'],
      schedules: {
        'C': { room: 'G306', day: 'FRIDAY', hour: '10', maxGpe: 60, current: 42 },
        'D': { room: 'G307', day: 'SATURDAY', hour: '08', maxGpe: 60, current: 38 }
      },
      credits: 4,
      creditCost: 21407
    },
    {
      name: 'Best Programming Practice Design Patterns',
      code: 'SENG 8415',
      groups: ['A', 'B'],
      schedules: {
        'A': { room: 'G201', day: 'TUESDAY', hour: '16', maxGpe: 60, current: 47 },
        'B': { room: 'G202', day: 'WEDNESDAY', hour: '16', maxGpe: 60, current: 51 }
      },
      credits: 3,
      creditCost: 21407
    }
  ];

  const handleCourseChange = (e) => {
    const courseName = e.target.value;
    setSelectedCourse(courseName);
    
    const course = availableCourses.find(c => c.name === courseName);
    if (course) {
      setSelectedCode(course.code);
      setSelectedGroup('');
      setCourseDetails(course);
    } else {
      setSelectedCode('');
      setSelectedGroup('');
      setCourseDetails(null);
    }
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const addCourse = () => {
    if (!selectedCourse || !selectedGroup || !courseDetails) {
      alert('Please select a course and group');
      return;
    }

    // Check if course already registered
    const alreadyRegistered = registeredCourses.find(
      c => c.code === courseDetails.code
    );

    if (alreadyRegistered) {
      alert('This course is already registered');
      return;
    }

    const schedule = courseDetails.schedules[selectedGroup];
    const newCourse = {
      code: courseDetails.code,
      name: courseDetails.name,
      credits: courseDetails.credits,
      creditCost: courseDetails.creditCost,
      amount: courseDetails.credits * courseDetails.creditCost,
      group: selectedGroup,
      room: schedule.room,
      day: schedule.day,
      hour: schedule.hour
    };

    setRegisteredCourses([...registeredCourses, newCourse]);
    
    // Reset selection
    setSelectedCourse('');
    setSelectedCode('');
    setSelectedGroup('');
    setCourseDetails(null);
  };

  const withdrawCourse = (code) => {
    setRegisteredCourses(registeredCourses.filter(c => c.code !== code));
  };

  const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);
  const totalCreditCost = registeredCourses.reduce((sum, course) => sum + course.amount, 0);
  const regFee = 25000;
  const lifeAssuranceFee = 0;
  const graduationFee = 0;
  const grandTotal = totalCreditCost + regFee + lifeAssuranceFee + graduationFee;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW').format(amount);
  };

  const getScheduleForGroup = () => {
    if (courseDetails && selectedGroup) {
      return courseDetails.schedules[selectedGroup];
    }
    return null;
  };

  const schedule = getScheduleForGroup();

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Student Info Header */}
        <div className="header-card">
          <h1 className="page-title">Student Registration - Semester 2025/I</h1>
          <div className="student-info">
            <div className="info-item">
              <span className="info-label">Full name:</span>
              <span className="info-value">Mugisha Leopold</span>
            </div>
            <div className="info-item">
              <span className="info-label">Reg. Nr.:</span>
              <span className="info-value">26636</span>
            </div>
            <div className="info-item">
              <span className="info-label">Faculty:</span>
              <span className="info-value">Information Technology</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department:</span>
              <span className="info-value">Software Engineering</span>
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

        {/* Course Selection Section */}
        <div className="section-card">
          <h2 className="section-title">Course</h2>
          
          <div className="course-selection">
            <div className="form-row">
              <div className="form-group">
                <label>Select course</label>
                <select 
                  value={selectedCourse} 
                  onChange={handleCourseChange}
                  className="form-select"
                >
                  <option value="">Choose a course...</option>
                  {availableCourses.map((course, index) => (
                    <option key={index} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Code</label>
                <input 
                  type="text" 
                  value={selectedCode} 
                  readOnly 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Group</label>
                <select 
                  value={selectedGroup} 
                  onChange={handleGroupChange}
                  className="form-select"
                  disabled={!courseDetails}
                >
                  <option value="">Select group...</option>
                  {courseDetails && courseDetails.groups.map((group, index) => (
                    <option key={index} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Room</label>
                <input 
                  type="text" 
                  value={schedule?.room || ''} 
                  readOnly 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Day</label>
                <input 
                  type="text" 
                  value={schedule?.day || ''} 
                  readOnly 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Hour</label>
                <input 
                  type="text" 
                  value={schedule?.hour || ''} 
                  readOnly 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Max Gpe</label>
                <input 
                  type="text" 
                  value={schedule?.maxGpe || ''} 
                  readOnly 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Current</label>
                <input 
                  type="text" 
                  value={schedule?.current || ''} 
                  readOnly 
                  className="form-input"
                />
              </div>
            </div>

            <div className="button-group">
              <button className="btn btn-primary" onClick={addCourse}>
                Add a Course
              </button>
            </div>
          </div>
        </div>

        {/* Fees Summary Section */}
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
                    {registeredCourses.map((course, index) => (
                      <tr key={index}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{formatCurrency(course.creditCost)}</td>
                        <td>{formatCurrency(course.amount)}</td>
                      </tr>
                    ))}
                    <tr className="totals-row">
                      <td colSpan="2"></td>
                      <td>{totalCredits}</td>
                      <td>{formatCurrency(107035)}.00 RWF</td>
                      <td>{formatCurrency(totalCreditCost)}.00 RWF</td>
                    </tr>
                    <tr className="fees-row">
                      <td colSpan="2">
                        <span>Reg. Fee: {formatCurrency(regFee)}.00 RWF</span>
                      </td>
                      <td>Life Assurance Fee: {lifeAssuranceFee}.00 RWF</td>
                      <td>Graduation Fee: {graduationFee}.00 RWF</td>
                      <td className="grand-total">Total: {formatCurrency(grandTotal)}.00 RWF</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registered Courses Section */}
            <div className="section-card">
              <h2 className="section-title">Registered courses</h2>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>COURSE</th>
                      <th>CREDITS</th>
                      <th>GROUP</th>
                      <th>ROOM</th>
                      <th>DAY</th>
                      <th>HOUR</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredCourses.map((course, index) => (
                      <tr key={index}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{course.group}</td>
                        <td>{course.room}</td>
                        <td>{course.day}</td>
                        <td>{course.hour}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => withdrawCourse(course.code)}
                          >
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

export default App;