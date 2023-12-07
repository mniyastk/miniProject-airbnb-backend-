const router = require("express").Router();
const { userRegistration, userLogin, showStays, specificStay } = require("../controller/userController");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/joiValidation");
router.post("/api/user/register", registerValidation, userRegistration);
router.post("/api/user/login", loginValidation, userLogin);
router.get("/api/user/stays",showStays)
router.get("/api/user/:id",specificStay)
module.exports = router;
