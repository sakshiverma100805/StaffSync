const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeName: { type: String },
  employeeEmail: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approverRole: {
    type: String,
    enum: ['HR', 'Manager']
  },
  approvedBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
