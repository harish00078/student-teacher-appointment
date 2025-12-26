const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { book, updateStatus } = require("../controllers/appointment.controller");

router.post("/", auth, book);
router.put("/:id", auth, updateStatus);
module.exports = router;
