const Announcement = require('../models/Announcement');

let memoryAnnouncements = [
  {
    _id: 'anc_1',
    title: 'Quarterly Town Hall & Product Roadmap 2026',
    message: 'Join us this Friday at 3:00 PM IST for our Q4 all-hands town hall meeting with executive leadership.',
    targetAudience: 'All',
    createdByName: 'HR Department',
    createdAt: '2025-11-01T10:00:00Z'
  },
  {
    _id: 'anc_2',
    title: 'Annual Performance Appraisal Cycle Kickoff',
    message: 'The self-evaluation portal is now open for the annual review cycle. Please submit reviews before Nov 20.',
    targetAudience: 'Employees',
    createdByName: 'HR Department',
    createdAt: '2025-10-28T09:30:00Z'
  },
  {
    _id: 'anc_3',
    title: 'Leadership & Team Lead Sync',
    message: 'All engineering managers and team leads please update the sprint capacity sheets before Monday.',
    targetAudience: 'Managers',
    createdByName: 'Operations Lead',
    createdAt: '2025-10-25T14:15:00Z'
  }
];

const getAnnouncements = async (req, res) => {
  try {
    const list = await Announcement.find({}).sort({ createdAt: -1 });
    if (list && list.length > 0) return res.json(list);
  } catch (err) {}
  res.json(memoryAnnouncements);
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetAudience } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    try {
      const created = await Announcement.create({
        title,
        message,
        targetAudience: targetAudience || 'All',
        createdBy: req.user?._id,
        createdByName: req.user?.name || 'HR Department'
      });
      return res.status(201).json(created);
    } catch (dbErr) {}

    const newAnc = {
      _id: 'anc_' + Date.now(),
      title,
      message,
      targetAudience: targetAudience || 'All',
      createdByName: req.user?.name || 'HR Department',
      createdAt: new Date().toISOString()
    };
    memoryAnnouncements.unshift(newAnc);
    res.status(201).json(newAnc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Announcement.findByIdAndDelete(id);
    } catch (dbErr) {}

    memoryAnnouncements = memoryAnnouncements.filter((a) => a._id !== id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
