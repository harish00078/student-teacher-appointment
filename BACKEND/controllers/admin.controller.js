const User = require("../models/User");

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