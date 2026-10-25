const Training = require('../models/Training');

let memoryTrainings = [
  {
    _id: 'trn_1',
    title: 'MongoDB CRUD',
    description: 'This Training Session relates to the MongoDB CRUD Operation and Schema Modeling.',
    date: '2025-11-05',
    trainer: 'Adnan Saif',
    assignedEmployeeId: 'All Employees',
    status: 'Scheduled',
    createdAt: '2025-10-24'
  },
  {
    _id: 'trn_2',
    title: 'Advanced React & State Management',
    description: 'Deep dive into hooks, context API, and modular performance tuning.',
    date: '2025-11-12',
    trainer: 'Sakshi Verma',
    assignedEmployeeId: 'Engineering Team',
    status: 'Scheduled',
    createdAt: '2025-10-26'
  },
  {
    _id: 'trn_3',
    title: 'Secure JWT Authentication & RBAC',
    description: 'Best practices for handling tokens, refresh rotation, and role-based permissions.',
    date: '2025-11-18',
    trainer: 'Security Lead',
    assignedEmployeeId: 'Backend Devs',
    status: 'Scheduled',
    createdAt: '2025-10-28'
  }
];

const getTrainings = async (req, res) => {
  try {
    const list = await Training.find({}).sort({ date: 1 });
    if (list && list.length > 0) return res.json(list);
  } catch (err) {}
  res.json(memoryTrainings);
};

const createTraining = async (req, res) => {
  try {
    const { title, description, date, trainer, assignedEmployeeId } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description, and date are required' });
    }

    try {
      const created = await Training.create({
        title,
        description,
        date,
        trainer: trainer || 'TBD',
        assignedEmployeeId: assignedEmployeeId || 'All',
        createdBy: req.user?._id
      });
      return res.status(201).json(created);
    } catch (dbErr) {}

    const newTrn = {
      _id: 'trn_' + Date.now(),
      title,
      description,
      date,
      trainer: trainer || 'TBD',
      assignedEmployeeId: assignedEmployeeId || 'All Employees',
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };
    memoryTrainings.push(newTrn);
    res.status(201).json(newTrn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Training.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json(updated);
    } catch (dbErr) {}

    const index = memoryTrainings.findIndex((t) => t._id === id);
    if (index !== -1) {
      memoryTrainings[index] = { ...memoryTrainings[index], ...req.body };
      return res.json(memoryTrainings[index]);
    }

    res.status(404).json({ message: 'Training not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Training.findByIdAndDelete(id);
    } catch (dbErr) {}

    memoryTrainings = memoryTrainings.filter((t) => t._id !== id);
    res.json({ message: 'Training deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrainings, createTraining, updateTraining, deleteTraining };
