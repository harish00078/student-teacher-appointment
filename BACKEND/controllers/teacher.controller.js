const Teacher = require("../models/Teacher");

exports.addTeacher = async (req, res) => {
  const teacher = await Teacher.create(req.body);
  res.json(teacher);
};

exports.getTeachers = async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
};
