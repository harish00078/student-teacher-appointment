const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const Teacher = require("../models/Teacher");
const User = require("../models/User");

exports.book = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      student: req.user.id
    });

    // Notify Teacher
    const teacher = await Teacher.findById(req.body.teacher);
    if (teacher) {
      // We need the student's name for a better message
      const student = await User.findById(req.user.id);
      await Notification.create({
        user: teacher.user_id,
        message: `New appointment request from ${student ? student.name : 'a student'} for ${appointment.date} at ${appointment.time}`
      });
    }

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
    ).populate('teacher');

    // Notify Student
    if (updated) {
      await Notification.create({
        user: updated.student, // Appointment stores student's User ID
        message: `Your appointment with ${updated.teacher.name} has been ${updated.status}`
      });
    }

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
        query = { student: req.user.id, isDeletedByStudent: { $ne: true } };
    } else if (role === 'teacher') {
        // Teacher logic is tricky because Appointment links to 'Teacher' ID, but req.user.id is 'User' ID.
        // We need to find the Teacher profile first.
        const teacherProfile = await Teacher.findOne({ user_id: req.user.id });
        if (!teacherProfile) {
            return res.json([]); // No teacher profile found
        }
        query = { teacher: teacherProfile._id, isDeletedByTeacher: { $ne: true } };
    }

    const appointments = await Appointment.find(query)
        .populate('student', 'name email')
        .populate('teacher', 'name subject');
        
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    // Authorization check
    if (req.user.role === 'student' && appointment.student.toString() !== req.user.id) {
      console.log(`Delete failed: Student ${req.user.id} tried to delete appointment ${appointment._id} owned by ${appointment.student}`);
      const error = new Error("Not authorized to delete this appointment");
      error.statusCode = 403;
      throw error;
    }

    if (req.user.role === 'teacher') {
      const teacherProfile = await Teacher.findOne({ user_id: req.user.id });
      if (!teacherProfile) {
          console.log(`Delete failed: Teacher profile not found for user ${req.user.id}`);
          const error = new Error("Teacher profile not found");
          error.statusCode = 403;
          throw error;
      }
      if (appointment.teacher.toString() !== teacherProfile._id.toString()) {
        console.log(`Delete failed: Teacher ${teacherProfile._id} tried to delete appointment ${appointment._id} owned by ${appointment.teacher}`);
        const error = new Error("Not authorized to delete this appointment");
        error.statusCode = 403;
        throw error;
      }
    }

    if (req.user.role === 'student') {
        appointment.isDeletedByStudent = true;
    } else if (req.user.role === 'teacher') {
        appointment.isDeletedByTeacher = true;
    }

    await appointment.save();

    // If both parties deleted it, remove from DB permanently
    if (appointment.isDeletedByStudent && appointment.isDeletedByTeacher) {
        await Appointment.findByIdAndDelete(req.params.id);
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
