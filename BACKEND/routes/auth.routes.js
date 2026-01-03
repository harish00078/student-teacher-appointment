const router = require("express").Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", auth, getMe);

module.exports = router;
