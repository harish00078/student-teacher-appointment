const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { getPendingStudents, approveStudent } = require("../controllers/admin.controller");

router.get("/pending-students", auth, role(["admin"]), getPendingStudents);
router.put("/approve-student/:id", auth, role(["admin"]), approveStudent);

module.exports = router;