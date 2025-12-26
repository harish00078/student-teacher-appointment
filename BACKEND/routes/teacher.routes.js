const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { addTeacher, getTeachers } = require("../controllers/teacher.controller");
const { teacherValidation } = require("../middlewares/validate.middleware");

router.post("/", auth, role(["admin"]), teacherValidation, addTeacher);
router.get("/", auth, getTeachers);
module.exports = router;
