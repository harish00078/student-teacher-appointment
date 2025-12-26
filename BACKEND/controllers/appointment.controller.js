const Appointment = require("../models/Appointment");

exports.book = async (req, res) => {
  const appointment = await Appointment.create({
    ...req.body,
    student: req.user.id
  });
  res.json(appointment);
};

exports.updateStatus = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
};
