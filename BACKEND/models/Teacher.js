const mongoose = require("mongoose");

module.exports = mongoose.model("Teacher", new mongoose.Schema({
  name: String,
  department: String,
  subject: String
}));
