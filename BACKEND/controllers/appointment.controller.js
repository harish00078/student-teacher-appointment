const Appointment = require("../models/Appointment");

exports.book = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      student: req.user.id
    });
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
};