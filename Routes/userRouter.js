const errorHandler = require('../middleware/errorHandler')
const router = require("express").Router();
const { userRegistration, userLogin, showStays, specificStay, addToWishlists, viewWishlists, booking } = require("../controller/userController");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/joiValidation");
const userAuth = require('../middleware/userAuth');
router.post("/api/user/register", registerValidation, userRegistration);
router.post("/api/user/login", userLogin);
router.get("/api/user/stays", showStays)
router.get("/api/user/:id",specificStay)
router.post("/api/user/wishlists/:id",userAuth, addToWishlists)
router.get("/api/user/stays/wishlists",userAuth,viewWishlists)
module.exports = router;
