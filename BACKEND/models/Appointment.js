const mongoose = require("mongoose");

module.exports = mongoose.model("Appointment", new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  date: String,
  time: String,
  status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], default: "pending" },
  message: String
}));
