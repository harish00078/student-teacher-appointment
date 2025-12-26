require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const uri = process.env.MONGO_URI;

console.log("Attempting to seed database...");
console.log("URI:", uri.replace(/:([^@]+)@/, ":****@")); // Log URI with hidden password

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
})
  .then(async () => {
    console.log("Connected to MongoDB Atlas successfully!");
    
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists. Skipping seed.");
      process.exit(0);
    }

    const hash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hash,
      role: "admin",
      isApproved: true
    });

    console.log("Seed successful!");
    console.log("Admin credentials: admin@example.com / admin123");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection Error Details:");
    console.error(err.message);
    if (err.reason) console.error("Reason:", err.reason);
    process.exit(1);
  });