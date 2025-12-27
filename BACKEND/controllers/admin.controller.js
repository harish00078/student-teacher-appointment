const User = require("../models/User");
const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");

exports.getPendingStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student', isApproved: false });
    res.json(students);
  } catch (error) {
    next(error);
  }
};

exports.approveStudent = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.createTeacher = async (req, res, next) => {
  let user = null;
  try {
    const { name, email, password, department, subject } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.statusCode = 400;
      throw error;
    }

    const hash = await bcrypt.hash(password, 10);
    
    // 1. Create User
    user = await User.create({
      name,
      email,
      password: hash,
      role: 'teacher',
      isApproved: true // Teachers added by admin are auto-approved
    });

    // 2. Create Teacher Profile
    const teacher = await Teacher.create({
      user_id: user._id,
      name,
      department,
      subject
    });

    res.status(201).json({ user, teacher });
  } catch (error) {
    // Manual Rollback if User was created but Teacher failed
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
    next(error);
  }
};