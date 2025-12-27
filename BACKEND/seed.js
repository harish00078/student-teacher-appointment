const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

console.log("Attempting to seed database...");
console.log("URI:", uri.replace(/:([^@]+)@/, ":****@")); // hide password

const connectDBAndSeed = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ Connected to MongoDB Atlas");

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("⚠️ Admin already exists. Skipping seed.");
      await mongoose.disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isApproved: true,
    });

    console.log("✅ Seed successful!");
    console.log("Admin credentials:");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed");
    console.error("Message:", error.message);

    if (error.reason) {
      console.error("Reason:", error.reason);
    }

    process.exit(1);
  }
};

connectDBAndSeed();