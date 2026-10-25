const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeName: { type: String },
  date: { type: Date, required: true },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Day'],
    default: 'Present'
  },
  createdAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
