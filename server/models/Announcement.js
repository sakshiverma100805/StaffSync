const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: { type: String, default: 'HR Department' },
    targetAudience: {
      type: String,
      enum: ['All', 'Employees', 'Managers'],
      default: 'All'
    }
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
