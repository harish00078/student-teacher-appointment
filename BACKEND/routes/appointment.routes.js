const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { book, updateStatus } = require("../controllers/appointment.controller");
const { appointmentValidation, updateStatusValidation } = require("../middlewares/validate.middleware");

router.post("/", auth, role(["student"]), appointmentValidation, book);
router.put("/:id", auth, role(["teacher"]), updateStatusValidation, updateStatus);
module.exports = router;
