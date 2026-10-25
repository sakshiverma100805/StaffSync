import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { FileCheck, Check, X, Search, Filter, CheckCircle2, User, Calendar } from 'lucide-react';

const ManagerLeaveApplications = () => {
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
    updateLeaveStatus(id, 'Approved', 'Manager', user?.name || 'Engineering Manager');
    showNotification(`Approved team leave request for ${name}.`);
  };

  const handleReject = (id, name) => {
    updateLeaveStatus(id, 'Rejected', 'Manager', user?.name || 'Engineering Manager');
    showNotification(`Rejected team leave request for ${name}.`);
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
    <div className="manager-leaves-module">
      {notification && (
        <div className="auth-alert success mb-4">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      <div className="dashboard-section-card">
        <div className="card-heading-row flex-wrap">
          <div className="heading-with-icon">
            <FileCheck size={20} className="text-blue" />
            <h3>Team Leave Applications</h3>
          </div>

          <div className="table-search-filter-row">
            <div className="search-input-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search requests..."
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

        {/* Card grid layout matching page 57 screenshot */}
        <div className="manager-leave-cards-grid">
          {filteredLeaves.length === 0 ? (
            <div className="empty-state-notice">
              <p>No team leave applications found matching current criteria.</p>
            </div>
          ) : (
            filteredLeaves.map((leave) => (
              <div key={leave._id} className="manager-leave-card">
                <div className="leave-card-top">
                  <div className="leave-applicant-info">
                    <User size={16} className="text-blue" />
                    <div>
                      <h4 className="applicant-name">{leave.employeeName}</h4>
                      <span className="applicant-email">({leave.employeeEmail})</span>
                    </div>
                  </div>
                  <span
                    className={`badge-status ${
                      leave.status === 'Approved'
                        ? 'badge-approved'
                        : leave.status === 'Rejected'
                        ? 'badge-rejected'
                        : 'badge-pending'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>

                <div className="leave-card-details">
                  <div className="detail-row">
                    <span className="detail-key">From:</span>
                    <span className="detail-val">{formatDate(leave.startDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">To:</span>
                    <span className="detail-val">{formatDate(leave.endDate)}</span>
                  </div>
                  <div className="detail-row reason-row">
                    <span className="detail-key">Reason:</span>
                    <p className="detail-reason-val">{leave.reason}</p>
                  </div>
                  {leave.approverRole && (
                    <div className="detail-row">
                      <span className="detail-key">Approved/Rejected By:</span>
                      <span className="detail-val text-blue">
                        {leave.approverRole} {leave.approvedBy ? `(${leave.approvedBy})` : ''}
                      </span>
                    </div>
                  )}
                </div>

                <div className="leave-card-actions">
                  <button
                    type="button"
                    onClick={() => handleApprove(leave._id, leave.employeeName)}
                    className="btn-status-action btn-approve flex-1"
                    disabled={leave.status === 'Approved'}
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(leave._id, leave.employeeName)}
                    className="btn-status-action btn-reject flex-1"
                    disabled={leave.status === 'Rejected'}
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerLeaveApplications;
