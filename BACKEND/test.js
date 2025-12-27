require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ DB Connected");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  });