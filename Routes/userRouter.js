// const errorHandler = require("../middleware/errorHandler");
const router = require("express").Router();
const {
  userRegistration,
  userLogin,
  showStays,
  specificStay,
  addToWishlists,
  viewWishlists,
  deleteWishlist,
  bookStay,
  orderCreate,
  verifyPayment,
  showBookings,
  cancelBooking,
  googleLogin,
  bookedDates,
  stysCategory,
  searchResults,
 
} = require("../controller/userController");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/joiValidation");
const userAuth = require("../middleware/userAuth");
router.post("/api/user/register", registerValidation, userRegistration);
router.post("/api/user/google/registration",googleLogin)
router.post("/api/user/login", userLogin);
router.get("/api/user/stays", showStays);
router.get("/api/user/:id", specificStay);
router.post("/api/user/wishlists/:id", userAuth, addToWishlists);
router.get("/api/user/stays/wishlists", userAuth, viewWishlists);
router.delete("/api/user/wishlists/:id", userAuth, deleteWishlist);
router.post("/api/user/booking/:id", userAuth, bookStay);
router.post("/api/user/booking/order/create", orderCreate);
router.post("/api/user/booking/order/verify",verifyPayment)
router.get("/api/user/bookings/all",userAuth,showBookings)
router.delete("/api/user/booking/cancel/stay",userAuth,cancelBooking)
router.get("/api/users/bookings/booking/dates",bookedDates)
router.get("/api/users/properties/category?",stysCategory)
router.get("/api/users/properties/search?",searchResults)



// router.post('/api/user/logout',logOut)
module.exports = router;
