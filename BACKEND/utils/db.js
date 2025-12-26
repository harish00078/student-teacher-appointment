const mongoose = require("mongoose");
require("dotenv").config(); // Ensure env vars are loaded

module.exports = () => {
  console.log("Connecting to MongoDB at:", process.env.MONGO_URI);
  return mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
};
