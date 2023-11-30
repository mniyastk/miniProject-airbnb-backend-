const router = require("express").Router();
const {
  userRegistration,
  userLogin,
//   fetchData,
} = require("../controller/userController");
const { registerValidation, loginValidation } = require("../middleware/joiValidation");
router.post("/api/user/register",registerValidation ,userRegistration);
router.post("/api/user/login",loginValidation, userLogin);
// router.get("/api/users/fetch", fetchData);
module.exports = router;
