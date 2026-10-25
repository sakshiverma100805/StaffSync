import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, LogIn, LogOut, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';

const Attendance = () => {
  const { attendance, isCheckedIn, handleCheckIn, handleCheckOut } = useData();
  const { user } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [actionSuccess, setActionSuccess] = useState('');

  // Live digital clock display
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onCheckInClick = () => {
    handleCheckIn(user?.name || 'Pravanshu Samadhiya');
    setActionSuccess('Successfully checked in! Have a productive workday.');
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const onCheckOutClick = () => {
    handleCheckOut();
    setActionSuccess('Successfully checked out! Attendance record updated.');
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // Filter attendance for current employee or show all personal records
  const myAttendance = attendance.filter(
    (a) => !a.employeeName || a.employeeName.toLowerCase().includes(user?.name?.toLowerCase().split(' ')[0] || 'pravanshu')
  );

  return (
    <div className="attendance-module-container">
      {/* Attendance Action Card matching page 55 */}
      <div className="attendance-action-card">
        <div className="attendance-clock-section">
          <div className="live-clock-badge">
            <Clock size={16} className="text-blue" />
            <span>Live System Time</span>
          </div>
          <div className="digital-clock">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </div>
          <div className="clock-date">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <div className="attendance-toggle-section">
          <div className="current-status-display">
            <span className="status-label">Today's Status:</span>
            <span className={`status-pill ${isCheckedIn ? 'pill-active' : 'pill-inactive'}`}>
              {isCheckedIn ? 'Checked In (Active)' : 'Not Checked In'}
            </span>
          </div>

          {!isCheckedIn ? (
            <button
              type="button"
              onClick={onCheckInClick}
              className="btn-attendance-action checkin-btn"
            >
              <LogIn size={20} />
              <span>Check In</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCheckOutClick}
              className="btn-attendance-action checkout-btn"
            >
              <LogOut size={20} />
              <span>Check Out</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="auth-alert success mb-4">
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Attendance History Section matching page 55 */}
      <div className="dashboard-section-card">
        <div className="card-heading-row">
          <div className="heading-with-icon">
            <Calendar size={20} className="text-blue" />
            <h3>My Attendance History</h3>
          </div>
          <span className="count-badge">{myAttendance.length} Logs</span>
        </div>

        <div className="attendance-records-list">
          {myAttendance.length === 0 ? (
            <div className="empty-state-notice">
              <p>No attendance logs recorded yet.</p>
            </div>
          ) : (
            myAttendance.map((rec) => (
              <div key={rec._id} className="attendance-record-row">
                <div className="attendance-date-col">
                  <span className="rec-date-bold">
                    {new Date(rec.date).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="rec-user-sub">{rec.employeeName}</span>
                </div>

                <div className="attendance-times-col">
                  <div className="time-metric">
                    <span className="metric-label">Check In:</span>
                    <span className="metric-val text-green">{rec.checkInTime || '--'}</span>
                  </div>
                  <div className="time-metric">
                    <span className="metric-label">Check Out:</span>
                    <span className="metric-val text-blue">{rec.checkOutTime || '--'}</span>
                  </div>
                </div>

                <div className="attendance-status-col">
                  <span
                    className={`badge-status ${
                      rec.status === 'Present'
                        ? 'badge-present'
                        : rec.status === 'Half Day'
                        ? 'badge-halfday'
                        : 'badge-absent'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
