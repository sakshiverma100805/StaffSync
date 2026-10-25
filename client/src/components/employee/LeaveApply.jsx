import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, FileText, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const LeaveApply = ({ onLeaveApplied }) => {
  const { applyLeave } = useData();
  const { user } = useAuth();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!startDate || !endDate || !reason.trim()) {
      setError('Please provide start date, end date, and reason for leave.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be later than end date.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      applyLeave({
        employeeName: user?.name || 'Pravanshu Samadhiya',
        employeeEmail: user?.email || 'Pravanshu@gmail.com',
        startDate,
        endDate,
        reason: reason.trim()
      });

      setIsSubmitting(false);
      setSuccess('Leave application submitted successfully! Your manager/HR will review it.');
      setStartDate('');
      setEndDate('');
      setReason('');

      if (onLeaveApplied) onLeaveApplied();
      setTimeout(() => setSuccess(''), 4000);
    }, 300);
  };

  return (
    <div className="dashboard-section-card mb-6">
      <div className="card-heading-row">
        <div className="heading-with-icon">
          <Calendar size={20} className="text-blue" />
          <h3>Apply for Leave</h3>
        </div>
        <span className="card-sub-hint">Formal Time-Off Request</span>
      </div>

      {error && (
        <div className="auth-alert error mb-4">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="auth-alert success mb-4">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Form matching page 54 */}
      <form onSubmit={handleSubmit} className="leave-apply-form">
        <div className="form-grid-two">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <div className="input-with-icon">
              <Calendar size={16} className="input-icon" />
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <div className="input-with-icon">
              <Calendar size={16} className="input-icon" />
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason for Leave</label>
          <div className="input-with-icon">
            <FileText size={16} className="input-icon" />
            <textarea
              id="reason"
              rows={3}
              placeholder="e.g. Urgent family emergency, medical consultation, personal trip..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-blue-submit" disabled={isSubmitting}>
          <Send size={16} />
          <span>{isSubmitting ? 'Submitting Application...' : 'Apply Leave'}</span>
        </button>
      </form>
    </div>
  );
};

export default LeaveApply;
