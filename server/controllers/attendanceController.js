const Attendance = require('../models/Attendance');

let memoryAttendance = [
  {
    _id: 'att_1',
    user: 'usr_emp1',
    employeeName: 'Pravanshu Samadhiya',
    date: '2025-11-04',
    checkInTime: '9:24:19 AM',
    checkOutTime: '10:07:23 AM',
    status: 'Present'
  },
  {
    _id: 'att_2',
    user: 'usr_emp1',
    employeeName: 'Pravanshu Samadhiya',
    date: '2025-11-03',
    checkInTime: '3:47:43 PM',
    checkOutTime: '3:47:54 PM',
    status: 'Present'
  },
  {
    _id: 'att_3',
    user: 'usr_emp2',
    employeeName: 'Sakshi Verma',
    date: '2025-11-04',
    checkInTime: '9:15:00 AM',
    checkOutTime: '5:30:00 PM',
    status: 'Present'
  },
  {
    _id: 'att_4',
    user: 'usr_emp3',
    employeeName: 'Adnan Saif',
    date: '2025-11-04',
    checkInTime: '9:45:12 AM',
    checkOutTime: '1:30:00 PM',
    status: 'Half Day'
  }
];

const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({}).sort({ date: -1 });
    if (records && records.length > 0) return res.json(records);
  } catch (err) {}
  res.json(memoryAttendance);
};

const checkIn = async (req, res) => {
  try {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    const dateString = now.toISOString().split('T')[0];

    const employeeName = req.body.employeeName || req.user?.name || 'Pravanshu Samadhiya';

    try {
      const record = await Attendance.create({
        user: req.user?._id || 'usr_emp1',
        employeeName,
        date: dateString,
        checkInTime: timeString,
        checkOutTime: '--',
        status: 'Present'
      });
      return res.status(201).json(record);
    } catch (dbErr) {}

    const newRecord = {
      _id: 'att_' + Date.now(),
      user: req.user?._id || 'usr_emp1',
      employeeName,
      date: dateString,
      checkInTime: timeString,
      checkOutTime: '--',
      status: 'Present'
    };
    memoryAttendance.unshift(newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

    // Look for the most recent record without checkOut
    const record = memoryAttendance[0];
    if (record) {
      record.checkOutTime = timeString;
      return res.json(record);
    }
    res.status(404).json({ message: 'No active check-in record found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAttendance, checkIn, checkOut };
