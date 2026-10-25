import React from 'react';
import { useData } from '../../context/DataContext';
import { Bell, BookOpen, Calendar, UserCheck, Sparkles, Tag } from 'lucide-react';

const Announcements = () => {
  const { announcements, trainings } = useData();

  // Filter announcements relevant to employees
  const employeeAnnouncements = announcements.filter(
    (a) => a.targetAudience === 'All' || a.targetAudience === 'Employees'
  );

  return (
    <div className="employee-announcements-view">
      <div className="two-column-grid">
        {/* Left Column: Company Announcements */}
        <div className="dashboard-section-card">
          <div className="card-heading-row">
            <div className="heading-with-icon">
              <Bell size={20} className="text-blue" />
              <h3>Company Announcements</h3>
            </div>
            <span className="count-badge">{employeeAnnouncements.length} Active</span>
          </div>

          <div className="announcements-list">
            {employeeAnnouncements.length === 0 ? (
              <div className="empty-state-notice">
                <p>No announcements available at this time.</p>
              </div>
            ) : (
              employeeAnnouncements.map((item) => (
                <div key={item._id} className="announcement-item-card">
                  <div className="announcement-header">
                    <h4 className="announcement-title">{item.title}</h4>
                    <span className="announcement-badge">
                      <Tag size={12} /> {item.targetAudience}
                    </span>
                  </div>
                  <p className="announcement-message">{item.message}</p>
                  <div className="announcement-footer">
                    <span className="announcement-author">
                      Posted by {item.createdByName || 'HR Operations'}
                    </span>
                    <span className="announcement-date">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Trainings matching page 53 */}
        <div className="dashboard-section-card">
          <div className="card-heading-row">
            <div className="heading-with-icon">
              <BookOpen size={20} className="text-cyan" />
              <h3>Assigned Trainings & Growth</h3>
            </div>
            <span className="count-badge count-cyan">{trainings.length} Programs</span>
          </div>

          <div className="trainings-list">
            {trainings.length === 0 ? (
              <div className="empty-state-notice">
                <p>No training sessions scheduled.</p>
              </div>
            ) : (
              trainings.map((trn) => (
                <div key={trn._id} className="training-item-card">
                  <div className="training-badge-row">
                    <span className="training-topic-pill">
                      <Sparkles size={12} /> Training Module
                    </span>
                    <span className="training-status-tag">{trn.status || 'Scheduled'}</span>
                  </div>
                  <h4 className="training-title">{trn.title}</h4>
                  <p className="training-description">{trn.description}</p>
                  <div className="training-meta-grid">
                    <div className="meta-item">
                      <Calendar size={13} className="text-muted" />
                      <span>Date: <strong>{trn.date}</strong></span>
                    </div>
                    <div className="meta-item">
                      <UserCheck size={13} className="text-muted" />
                      <span>Trainer: <strong>{trn.trainer}</strong></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
