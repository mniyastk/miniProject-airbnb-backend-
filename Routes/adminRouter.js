const { findAllUsers, allListings, unverifiedListings, viewUnverifiedListing, approveListing, disapproveListing, blockUser } = require("../controller/adminController");

const router = require("express").Router();

router.get("/api/admin/users",findAllUsers)
router.get('/api/admin/listings',allListings)
router.get("/api/admin/unverfiedStays",unverifiedListings)
router.get("/api/admin/:id",viewUnverifiedListing)
router.put("/api/admin/verify/:id",approveListing)
router.delete("/api/admin/disapprove/:id",disapproveListing)
router.put("/api/admin/users/block_unblock/:id",blockUser)

module.exports = router;