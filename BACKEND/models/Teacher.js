const mongoose = require("mongoose");

module.exports = mongoose.model("Teacher", new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  department: String,
  subject: String
}));
