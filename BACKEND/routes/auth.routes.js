const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../middlewares/validate.middleware");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
module.exports = router;
