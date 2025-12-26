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

exports.getMyAppointments = async (req, res, next) => {
  try {
    const role = req.user.role;
    let query = {};
    
    if (role === 'student') {
        query = { student: req.user.id };
    } else if (role === 'teacher') {
        // Teacher logic is tricky because Appointment links to 'Teacher' ID, but req.user.id is 'User' ID.
        // We need to find the Teacher profile first.
        const Teacher = require("../models/Teacher");
        const teacherProfile = await Teacher.findOne({ user_id: req.user.id });
        if (!teacherProfile) {
            return res.json([]); // No teacher profile found
        }
        query = { teacher: teacherProfile._id };
    }

    const appointments = await Appointment.find(query)
        .populate('student', 'name email')
        .populate('teacher', 'name subject');
        
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};
