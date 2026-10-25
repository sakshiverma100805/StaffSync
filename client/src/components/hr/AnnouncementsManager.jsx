import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Send, Trash2, Tag, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const AnnouncementsManager = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useData();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All');
  const [notification, setNotification] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsPublishing(true);
    setTimeout(() => {
      addAnnouncement({
        title: title.trim(),
        message: message.trim(),
        targetAudience,
        createdByName: user?.name || 'HR Department'
      });
      setIsPublishing(false);
      setTitle('');
      setMessage('');
      showNotification('New announcement posted successfully across the organization.');
    }, 250);
  };

  const handleDelete = (id, ancTitle) => {
    if (window.confirm(`Are you sure you want to remove announcement: "${ancTitle}"?`)) {
      deleteAnnouncement(id);
      showNotification('Announcement deleted.');
    }
  };

  return (
    <div className="announcements-manager-module">
      {notification && (
        <div className="auth-alert success mb-4">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Post announcement form */}
      <div className="dashboard-section-card mb-6">
        <div className="card-heading-row">
          <div className="heading-with-icon">
            <Bell size={20} className="text-blue" />
            <h3>Post Organization Announcement</h3>
          </div>
          <span className="card-sub-hint">Broadcast notifications to team portals</span>
        </div>

        <form onSubmit={handlePublish} className="announcement-form">
          <div className="form-grid-two">
            <div className="form-group">
              <label htmlFor="anc-title">Announcement Headline *</label>
              <input
                id="anc-title"
                type="text"
                placeholder="e.g. Q4 Town Hall / Upcoming Holiday Notice"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="anc-audience">Target Audience *</label>
              <select
                id="anc-audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="select-custom"
              >
                <option value="All">All Organization Staff</option>
                <option value="Employees">Employees Only</option>
                <option value="Managers">Managers Only</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="anc-msg">Detailed Message *</label>
            <textarea
              id="anc-msg"
              rows={3}
              placeholder="Write the full announcement update for the team..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-blue-submit" disabled={isPublishing}>
            <Send size={16} />
            <span>{isPublishing ? 'Publishing...' : 'Publish Announcement'}</span>
          </button>
        </form>
      </div>

      {/* Published Announcements List */}
      <div className="dashboard-section-card">
        <div className="card-heading-row">
          <div className="heading-with-icon">
            <Tag size={20} className="text-blue" />
            <h3>Current Active Broadcasts</h3>
          </div>
          <span className="count-badge">{announcements.length} Total</span>
        </div>

        <div className="announcements-management-grid">
          {announcements.length === 0 ? (
            <div className="empty-state-notice">
              <p>No active announcements found.</p>
            </div>
          ) : (
            announcements.map((anc) => (
              <div key={anc._id} className="announcement-item-card manage-card">
                <div className="announcement-header">
                  <h4 className="announcement-title">{anc.title}</h4>
                  <div className="header-badges-right">
                    <span className="announcement-badge">
                      <Tag size={12} /> {anc.targetAudience}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(anc._id, anc.title)}
                      className="btn-delete-chip"
                      title="Delete this announcement"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="announcement-message">{anc.message}</p>

                <div className="announcement-footer">
                  <span className="announcement-author">
                    Posted by: <strong>{anc.createdByName || 'HR Operations'}</strong>
                  </span>
                  <span className="announcement-date">
                    <Calendar size={12} className="inline mr-1" />
                    {new Date(anc.createdAt).toLocaleDateString('en-US', {
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
    </div>
  );
};

export default AnnouncementsManager;
