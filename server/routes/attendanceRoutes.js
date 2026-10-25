const express = require('express');
const router = express.Router();
const { getAttendance, checkIn, checkOut } = require('../controllers/attendanceController');

router.route('/')
  .get(getAttendance);

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);

module.exports = router;
