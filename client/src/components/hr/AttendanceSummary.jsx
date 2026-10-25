import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, Search, Filter, UserCheck, Clock, UserX } from 'lucide-react';

const AttendanceSummary = () => {
  const { attendance } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Metrics
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const halfDayCount = attendance.filter((a) => a.status === 'Half Day').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;

  const filteredAttendance = attendance.filter((rec) => {
    const matchesSearch =
      rec.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      rec.date?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US');
  };

  return (
    <div className="attendance-summary-module">
      {/* Attendance Metrics Row */}
      <div className="metrics-summary-grid mb-6">
        <div className="metric-stat-card">
          <div className="metric-icon-box text-blue">
            <Calendar size={22} />
          </div>
          <div className="metric-text-box">
            <span className="metric-num">{attendance.length}</span>
            <span className="metric-label">Total Logs</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-icon-box text-green">
            <UserCheck size={22} />
          </div>
          <div className="metric-text-box">
            <span className="metric-num text-green">{presentCount}</span>
            <span className="metric-label">Present Records</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-icon-box text-amber">
            <Clock size={22} />
          </div>
          <div className="metric-text-box">
            <span className="metric-num text-amber">{halfDayCount}</span>
            <span className="metric-label">Half Day Logs</span>
          </div>
        </div>

        <div className="metric-stat-card">
          <div className="metric-icon-box text-rose">
            <UserX size={22} />
          </div>
          <div className="metric-text-box">
            <span className="metric-num text-rose">{absentCount}</span>
            <span className="metric-label">Absent Logs</span>
          </div>
        </div>
      </div>

      {/* Attendance Records Table matching page 57 */}
      <div className="dashboard-section-card">
        <div className="card-heading-row flex-wrap">
          <div className="heading-with-icon">
            <Calendar size={20} className="text-blue" />
            <h3>Attendance Records</h3>
          </div>

          <div className="table-search-filter-row">
            <div className="search-input-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Filter by employee name or date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-pills">
              {['All', 'Present', 'Half Day', 'Absent'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`filter-pill-btn ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="staffsync-data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-muted">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((rec) => (
                  <tr key={rec._id}>
                    <td className="font-semibold text-white">{rec.employeeName}</td>
                    <td>{formatDate(rec.date)}</td>
                    <td className="text-green font-mono">{rec.checkInTime || '--'}</td>
                    <td className="text-blue font-mono">{rec.checkOutTime || '--'}</td>
                    <td>
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
