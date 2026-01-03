const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { book, updateStatus, getMyAppointments, deleteAppointment } = require("../controllers/appointment.controller");
const { appointmentValidation, updateStatusValidation } = require("../middlewares/validate.middleware");

router.get("/my-appointments", auth, getMyAppointments);
router.post("/", auth, role(["student"]), appointmentValidation, book);
router.put("/:id", auth, role(["teacher"]), updateStatusValidation, updateStatus);
router.delete("/:id", auth, role(["teacher"]), deleteAppointment);

module.exports = router;
