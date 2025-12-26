const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const errorHandler = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const teacherRoutes = require("./routes/teacher.routes");
const appointmentRoutes = require("./routes/appointment.routes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use(errorHandler);

module.exports = app;
