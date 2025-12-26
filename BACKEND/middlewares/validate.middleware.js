const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'teacher', 'student']).withMessage('Invalid role'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const teacherValidation = [
  body('user_id').notEmpty().withMessage('User ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  validate
];

const appointmentValidation = [
  body('teacher').notEmpty().withMessage('Teacher ID is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  validate
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  teacherValidation,
  appointmentValidation,
  updateStatusValidation
};
