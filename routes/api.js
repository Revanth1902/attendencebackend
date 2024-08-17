const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or Update User
router.post('/user', async (req, res) => {
  try {
    const { userId, semesterStartDate, semesterEndDate } = req.body;
    const user = await User.findOneAndUpdate(
      { userId },
      { semesterStartDate, semesterEndDate },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or Update Attendance
router.post('/attendance', async (req, res) => {
  try {
    const { userId, date, status, holidayName } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const attendance = { date, status, holidayName };
    user.attendance.push(attendance);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or Update Timetable
router.post('/timetable', async (req, res) => {
  try {
    const { userId, timetable } = req.body;
    const user = await User.findOneAndUpdate(
      { userId },
      { timetable },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or Update Task
router.post('/task', async (req, res) => {
  try {
    const { userId, taskName } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.tasks.push({ taskName });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or Update Goal
router.post('/goal', async (req, res) => {
  try {
    const { userId, goalName, goalEndDate, goalDescription } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.goals.push({ goalName, goalEndDate, goalDescription });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Data
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset User Data
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findOneAndDelete({ userId });
    res.json({ message: 'User data reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
