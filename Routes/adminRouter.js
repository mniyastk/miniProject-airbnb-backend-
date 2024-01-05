const { findAllUsers, allListings, unverifiedListings, viewUnverifiedListing, approveListing, disapproveListing, blockUser, adminLogin } = require("../controller/adminController");
const adminAuth = require("../middleware/adminAuth");

const router = require("express").Router();

router.post("/api/admin/login",adminLogin)

router.get("/api/admin/users",adminAuth,findAllUsers)
router.get('/api/admin/listings',adminAuth,allListings)
router.get("/api/admin/unverfiedStays",adminAuth,unverifiedListings)
router.get("/api/admin/:id",adminAuth,viewUnverifiedListing)
router.put("/api/admin/verify/:id",adminAuth,approveListing)
router.delete("/api/admin/disapprove/:id",adminAuth,disapproveListing)
router.put("/api/admin/users/block_unblock/:id",adminAuth,blockUser)

module.exports = router;