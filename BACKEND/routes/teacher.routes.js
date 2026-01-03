const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { addTeacher, getTeachers, updateTeacher, deleteTeacher } = require("../controllers/teacher.controller");
const { teacherValidation } = require("../middlewares/validate.middleware");

router.post("/", auth, role(["admin"]), teacherValidation, addTeacher);
router.get("/", auth, getTeachers);
router.put("/:id", auth, role(["admin"]), updateTeacher);
router.delete("/:id", auth, role(["admin"]), deleteTeacher);

module.exports = router;
