const Teacher = require("../models/Teacher");
const User = require("../models/User");

exports.addTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().populate('user_id', 'email');
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const { name, department, subject, email } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id, 
      { name, department, subject }, 
      { new: true }
    );
    
    if (!teacher) {
      const error = new Error("Teacher not found");
      error.statusCode = 404;
      throw error;
    }

    // Update linked User if needed
    if (teacher.user_id) {
        const updateData = { name };
        if (email) updateData.email = email;
        await User.findByIdAndUpdate(teacher.user_id, updateData);
    }

    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      const error = new Error("Teacher not found");
      error.statusCode = 404;
      throw error;
    }

    if (teacher.user_id) {
      await User.findByIdAndDelete(teacher.user_id);
    }
    
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher and associated user deleted successfully" });
  } catch (error) {
    next(error);
  }
};