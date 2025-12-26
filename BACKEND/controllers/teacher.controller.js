const Teacher = require("../models/Teacher");

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
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};