const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { addTeacher, getTeachers } = require("../controllers/teacher.controller");

router.post("/", auth, role(["admin"]), addTeacher);
router.get("/", auth, getTeachers);
module.exports = router;
