const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Teacher = require("../models/Teacher");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      name, 
      email, 
      password: hash, 
      role,
      isApproved: role === 'admin' 
    });

    // Automatically create Teacher profile if role is teacher
    if (role === 'teacher') {
      await Teacher.create({
        user_id: user._id,
        name: user.name,
        department: "General", // Default/Placeholder
        subject: "General"     // Default/Placeholder
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; 
      throw error;
    }

    if (user.role === 'student' && !user.isApproved) {
        const error = new Error("Account not approved yet. Please wait for admin approval.");
        error.statusCode = 403;
        throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    
    let profileData = {};
    if (user.role === 'teacher') {
      const teacherProfile = await Teacher.findOne({ user_id: user._id });
      if (teacherProfile) {
        profileData = {
          department: teacherProfile.department,
          subject: teacherProfile.subject
        };
      }
    }

    res.json({ 
      token, 
      role: user.role, 
      name: user.name,
      ...profileData
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    let profileData = {};
    if (user.role === 'teacher') {
      const teacherProfile = await Teacher.findOne({ user_id: user._id });
      if (teacherProfile) {
        profileData = {
          department: teacherProfile.department,
          subject: teacherProfile.subject
        };
      }
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...profileData
    });
  } catch (error) {
    next(error);
  }
};