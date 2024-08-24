const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cron = require("node-cron");
// Create or Update User
// cron job for deleting expired goals
cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    // Ensure that `goalEndDate` is compared correctly
    await User.updateMany(
      { "goals.goalEndDate": { $lt: today } },
      { $pull: { goals: { goalEndDate: { $lt: today } } } }
    );
    console.log("Expired goals removed successfully");
  } catch (err) {
    console.error("Error removing expired goals:", err.message);
  }
});

router.post("/user", async (req, res) => {
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
// Add or Update Attendance
router.post("/attendance", async (req, res) => {
  try {
    const { userId, date, status, holidayName } = req.body;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Convert date to Date object and standardize for comparison
    const attendanceDate = new Date(date).toDateString();

    // Check if attendance for the date already exists
    const existingAttendance = user.attendance.find(
      (att) => new Date(att.date).toDateString() === attendanceDate
    );

    if (existingAttendance) {
      if (existingAttendance.status === status) {
        // If the status is the same, return a message
        return res.status(400).json({
          message: `Already logged this date as ${status}`,
        });
      } else {
        // If the status is different, update it with the new one
        existingAttendance.status = status;
        if (status === "holiday") {
          existingAttendance.holidayName =
            holidayName || existingAttendance.holidayName;
        } else {
          existingAttendance.holidayName = undefined; // Clear holidayName if it's not a holiday
        }
        await user.save();
        return res.json({ message: "Attendance updated successfully", user });
      }
    }

    // If no existing record for the date, add a new one
    const newAttendance = { date, status, holidayName };
    user.attendance.push(newAttendance);
    await user.save();

    res.json({ message: "Attendance logged successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or Update Timetable
router.post("/timetable", async (req, res) => {
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
router.post("/task", async (req, res) => {
  try {
    const { userId, taskName } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.tasks.push({ taskName });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or Update Goal
router.post("/goal", async (req, res) => {
  try {
    const { userId, goalName, goalEndDate, goalDescription } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Optionally, you can include createdOn if you want to set it manually
    const newGoal = {
      goalName,
      goalEndDate,
      goalDescription,
      createdOn: new Date(), // This will explicitly set createdOn if needed
    };

    user.goals.push(newGoal);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Data
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset User Data
router.delete("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findOneAndDelete({ userId });
    res.json({ message: "User data reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete a Task by Task ID
router.delete("/user/:userId/task/:taskId", async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Filter out the task with the specified taskId
    user.tasks = user.tasks.filter((task) => task._id.toString() !== taskId);

    await user.save();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
