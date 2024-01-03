const { findAllUsers, allListings, unverifiedListings, viewUnverifiedListing, approveListing } = require("../controller/adminController");

const router = require("express").Router();

router.get("/api/admin/users",findAllUsers)
router.get('/api/admin/listings',allListings)
router.get("/api/admin/unverfiedStays",unverifiedListings)
router.get("/api/admin/:id",viewUnverifiedListing)
router.put("/api/admin/verify/:id",approveListing)


module.exports = router;