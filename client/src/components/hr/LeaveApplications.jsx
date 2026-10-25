import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { FileCheck2, Check, X, Search, Filter, AlertCircle, CheckCircle } from 'lucide-react';

const LeaveApplications = () => {
  const { leaves, updateLeaveStatus } = useData();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleApprove = (id, name) => {
    updateLeaveStatus(id, 'Approved', 'HR', user?.name || 'HR Admin');
    showNotification(`Approved leave request for ${name}.`);
  };

  const handleReject = (id, name) => {
    updateLeaveStatus(id, 'Rejected', 'HR', user?.name || 'HR Admin');
    showNotification(`Rejected leave request for ${name}.`);
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      (leave.employeeName && leave.employeeName.toLowerCase().includes(search.toLowerCase())) ||
      (leave.employeeEmail && leave.employeeEmail.toLowerCase().includes(search.toLowerCase())) ||
      (leave.reason && leave.reason.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US');
  };

  return (
    <div className="leave-applications-module">
      {notification && (
        <div className="auth-alert success mb-4">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      <div className="dashboard-section-card">
        <div className="card-heading-row flex-wrap">
          <div className="heading-with-icon">
            <FileCheck2 size={20} className="text-blue" />
            <h3>Leave Applications (HR Review)</h3>
          </div>

          <div className="table-search-filter-row">
            <div className="search-input-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search leaves by name or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-pills">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
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

        {/* Table matching page 56 */}
        <div className="table-responsive-wrapper">
          <table className="staffsync-data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    No leave requests match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((item) => (
                  <tr key={item._id}>
                    <td className="font-semibold text-white">{item.employeeName}</td>
                    <td className="text-blue">{item.employeeEmail}</td>
                    <td>{formatDate(item.startDate)}</td>
                    <td>{formatDate(item.endDate)}</td>
                    <td className="text-truncate-cell" title={item.reason}>
                      {item.reason}
                    </td>
                    <td>
                      <span
                        className={`badge-status ${
                          item.status === 'Approved'
                            ? 'badge-approved'
                            : item.status === 'Rejected'
                            ? 'badge-rejected'
                            : 'badge-pending'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          type="button"
                          onClick={() => handleApprove(item._id, item.employeeName)}
                          className="btn-status-action btn-approve"
                          disabled={item.status === 'Approved'}
                          title="Approve Leave"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(item._id, item.employeeName)}
                          className="btn-status-action btn-reject"
                          disabled={item.status === 'Rejected'}
                          title="Reject Leave"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
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

export default LeaveApplications;
