const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  semesterStartDate: Date,
  semesterEndDate: Date,
  attendance: [
    {
      date: Date,
      status: { type: String, enum: ["present", "leave", "holiday"] },
      holidayName: String,
    },
  ],
  timetable: [
    {
      day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      periods: [String], // Subjects for each period
    },
  ],
  tasks: [{ taskName: String }],
  goals: [
    {
      goalName: String,
      goalEndDate: Date,
      goalDescription: String,
      createdOn: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
