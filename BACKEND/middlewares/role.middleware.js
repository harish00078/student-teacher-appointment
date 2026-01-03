module.exports = roles => (req, res, next) => {
  console.log(`Role Middleware: User role is '${req.user.role}', required roles are [${roles.join(', ')}]`);
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
