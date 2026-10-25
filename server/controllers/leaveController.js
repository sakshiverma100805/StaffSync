const Leave = require('../models/Leave');

let memoryLeaves = [
  {
    _id: 'leave_1',
    user: 'usr_emp1',
    employeeName: 'Pravanshu Samadhiya',
    employeeEmail: 'Pravanshu@gmail.com',
    startDate: '2025-11-05',
    endDate: '2025-11-06',
    reason: 'I have to go for Office Meeting',
    status: 'Approved',
    approverRole: 'HR',
    approvedBy: 'HR Admin',
    createdAt: '2025-11-01'
  },
  {
    _id: 'leave_2',
    user: 'usr_emp1',
    employeeName: 'Pravanshu Samadhiya',
    employeeEmail: 'Pravanshu@gmail.com',
    startDate: '2025-11-10',
    endDate: '2025-11-12',
    reason: 'Family function at hometown',
    status: 'Rejected',
    approverRole: 'HR',
    approvedBy: 'HR Admin',
    createdAt: '2025-11-02'
  },
  {
    _id: 'leave_3',
    user: 'usr_emp2',
    employeeName: 'Sakshi Verma',
    employeeEmail: 'sakshi.verma@staffsync.io',
    startDate: '2025-11-15',
    endDate: '2025-11-16',
    reason: 'Medical appointment',
    status: 'Pending',
    approverRole: null,
    approvedBy: null,
    createdAt: '2025-11-04'
  }
];

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({}).sort({ createdAt: -1 });
    if (leaves && leaves.length > 0) return res.json(leaves);
  } catch (err) {}
  res.json(memoryLeaves);
};

const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason, employeeName, employeeEmail } = req.body;
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Start date, end date, and reason are required' });
    }

    try {
      const leave = await Leave.create({
        user: req.user?._id || 'usr_emp1',
        employeeName: employeeName || req.user?.name || 'Pravanshu Samadhiya',
        employeeEmail: employeeEmail || req.user?.email || 'Pravanshu@gmail.com',
        startDate,
        endDate,
        reason,
        status: 'Pending'
      });
      return res.status(201).json(leave);
    } catch (dbErr) {}

    const newLeave = {
      _id: 'leave_' + Date.now(),
      user: req.user?._id || 'usr_emp1',
      employeeName: employeeName || req.user?.name || 'Pravanshu Samadhiya',
      employeeEmail: employeeEmail || req.user?.email || 'Pravanshu@gmail.com',
      startDate,
      endDate,
      reason,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    memoryLeaves.unshift(newLeave);
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approverRole } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
      const updated = await Leave.findByIdAndUpdate(
        id,
        { status, approverRole: approverRole || req.user?.role || 'HR' },
        { new: true }
      );
      if (updated) return res.json(updated);
    } catch (dbErr) {}

    const leave = memoryLeaves.find((l) => l._id === id);
    if (leave) {
      leave.status = status;
      leave.approverRole = approverRole || 'HR';
      return res.json(leave);
    }

    res.status(404).json({ message: 'Leave record not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaves, applyLeave, updateLeaveStatus };
