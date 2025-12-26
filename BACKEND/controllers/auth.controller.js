const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    // Students need approval, others (like if we allow self-registering teachers?) auto-approved for now? 
    // PDF says Admin adds teachers. So self-registration is likely for Students.
    // If a user self-registers as 'teacher', maybe we should block it or make it pending?
    // Let's assume self-registration is primarily for students.
    const isApproved = role === 'admin'; // Only admin is auto-approved initially? Or maybe just students need approval. 
    // "Approve Registration Student" implies students need it.
    
    const user = await User.create({ 
      name, 
      email, 
      password: hash, 
      role,
      isApproved: role === 'admin' // Only first admin is auto-approved, or maybe we manually approve.
      // Let's set default false in schema, but here we can override. 
      // Actually, let's keep it simple: If you register, you are pending unless you are admin? 
      // But how do you get the first admin? Usually seeded.
      // Let's set isApproved: false for everyone except maybe if we detect it's the first user? No.
      // Let's change the logic: Check if isApproved is true.
    });
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
    res.json({ token, role: user.role });
  } catch (error) {
    next(error);
  }
};