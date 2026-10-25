import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';

const LeaveList = () => {
  const { leaves } = useData();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter leaves for current employee
  const myLeaves = leaves.filter(
    (l) => !l.employeeName || l.employeeName.toLowerCase().includes(user?.name?.toLowerCase().split(' ')[0] || 'pravanshu')
  );

  const filteredLeaves = statusFilter === 'All'
    ? myLeaves
    : myLeaves.filter((l) => l.status === statusFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="badge-status badge-approved">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="badge-status badge-rejected">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="badge-status badge-pending">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="dashboard-section-card">
      <div className="card-heading-row">
        <div className="heading-with-icon">
          <Clock size={20} className="text-blue" />
          <h3>My Leaves</h3>
        </div>

        {/* Filter controls */}
        <div className="filter-controls-row">
          <Filter size={14} className="text-muted" />
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

      <div className="my-leaves-list">
        {filteredLeaves.length === 0 ? (
          <div className="empty-state-notice">
            <p>No leave requests found for the selected filter.</p>
          </div>
        ) : (
          filteredLeaves.map((leave) => (
            <div key={leave._id} className="leave-item-card">
              <div className="leave-item-content">
                <div className="leave-dates-row">
                  <span className="leave-dates-text">
                    {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                  </span>
                  {getStatusBadge(leave.status)}
                </div>
                <p className="leave-reason-text">{leave.reason}</p>
                <div className="leave-item-meta">
                  <span className="meta-sub">
                    Submitted: {formatDate(leave.createdAt)}
                  </span>
                  {leave.approverRole && (
                    <span className="meta-sub text-blue">
                      Reviewed by: {leave.approverRole}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaveList;
