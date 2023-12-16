const errorHandler = require('../middleware/errorHandler')
const router = require("express").Router();
const { userRegistration, userLogin, showStays, specificStay, addToWishlists, viewWishlists, booking, logOut, deleteWishlist, bookStay } = require("../controller/userController");
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
router.delete("/api/user/wishlists/:id",userAuth,deleteWishlist)
router.post("/api/user/booking/:id",userAuth,bookStay)
// router.post('/api/user/logout',logOut)
module.exports = router;
