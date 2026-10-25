import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BookOpen, Calendar, UserCheck, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

const TrainingManagement = () => {
  const { trainings, addTraining, updateTraining, deleteTraining } = useData();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    trainer: '',
    assignedEmployeeId: 'NA'
  });

  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditClick = (trn) => {
    setEditingId(trn._id);
    setFormData({
      title: trn.title,
      date: trn.date,
      description: trn.description,
      trainer: trn.trainer,
      assignedEmployeeId: trn.assignedEmployeeId || 'NA'
    });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      date: '',
      description: '',
      trainer: '',
      assignedEmployeeId: 'NA'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.description.trim()) {
      return;
    }

    if (editingId) {
      updateTraining(editingId, formData);
      showNotification(`Updated training "${formData.title}" successfully.`);
      handleCancelEdit();
    } else {
      addTraining({
        ...formData,
        trainer: formData.trainer.trim() || 'Adnan Saif'
      });
      showNotification(`Created training program "${formData.title}" successfully.`);
      setFormData({
        title: '',
        date: '',
        description: '',
        trainer: '',
        assignedEmployeeId: 'NA'
      });
    }
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete training module "${title}"?`)) {
      deleteTraining(id);
      showNotification(`Deleted training "${title}".`);
    }
  };

  return (
    <div className="training-management-module">
      {notification && (
        <div className="auth-alert success mb-4">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Training Creation Form matching page 58 */}
      <div className="dashboard-section-card mb-6">
        <div className="card-heading-row">
          <div className="heading-with-icon">
            <BookOpen size={20} className="text-blue" />
            <h3>{editingId ? 'Edit Training Program' : 'Training & Development'}</h3>
          </div>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="btn-cancel-edit">
              <X size={14} /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="training-form-grid">
          <div className="form-grid-two">
            <div className="form-group">
              <label htmlFor="trn-title">Training Title *</label>
              <input
                id="trn-title"
                name="title"
                type="text"
                placeholder="e.g. MongoDB CRUD"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="trn-date">Date (dd/mm/yyyy) *</label>
              <input
                id="trn-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="trn-desc">Description *</label>
            <textarea
              id="trn-desc"
              name="description"
              rows={2}
              placeholder="e.g. This Training Session relates to the MongoDB CRUD Operation"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-two">
            <div className="form-group">
              <label htmlFor="trn-trainer">Trainer Name</label>
              <input
                id="trn-trainer"
                name="trainer"
                type="text"
                placeholder="e.g. Adnan Saif"
                value={formData.trainer}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="trn-assigned">Assign To (Employee ID / Dept)</label>
              <input
                id="trn-assigned"
                name="assignedEmployeeId"
                type="text"
                placeholder="e.g. NA / All / emp_1"
                value={formData.assignedEmployeeId}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-blue-submit">
            <Plus size={16} />
            <span>{editingId ? 'Update Training' : 'Create Training'}</span>
          </button>
        </form>
      </div>

      {/* List of Trainings matching page 58 */}
      <div className="dashboard-section-card">
        <div className="card-heading-row">
          <div className="heading-with-icon">
            <Sparkles size={20} className="text-cyan" />
            <h3>Scheduled Training Sessions</h3>
          </div>
          <span className="count-badge count-cyan">{trainings.length} Modules</span>
        </div>

        <div className="trainings-display-grid">
          {trainings.length === 0 ? (
            <div className="empty-state-notice">
              <p>No training sessions currently scheduled.</p>
            </div>
          ) : (
            trainings.map((trn) => (
              <div key={trn._id} className="training-card-item">
                <div className="trn-card-header">
                  <h4 className="trn-title">{trn.title}</h4>
                  <span className="trn-status-badge">{trn.status || 'Scheduled'}</span>
                </div>

                <p className="trn-description">{trn.description}</p>

                <div className="trn-meta-list">
                  <div className="trn-meta-line">
                    <span className="trn-meta-label">Date:</span>
                    <span className="trn-meta-value">{trn.date}</span>
                  </div>
                  <div className="trn-meta-line">
                    <span className="trn-meta-label">Trainer:</span>
                    <span className="trn-meta-value font-semibold text-white">{trn.trainer}</span>
                  </div>
                  <div className="trn-meta-line">
                    <span className="trn-meta-label">Assigned To:</span>
                    <span className="trn-meta-value text-blue">{trn.assignedEmployeeId || 'NA'}</span>
                  </div>
                </div>

                <div className="trn-card-actions">
                  <button
                    type="button"
                    onClick={() => handleEditClick(trn)}
                    className="btn-trn-edit"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(trn._id, trn.title)}
                    className="btn-trn-delete"
                  >
                    <Trash2 size={13} /> Delete
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

export default TrainingManagement;
