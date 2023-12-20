const { findAllUsers, allListings } = require("../controller/adminController");

const router = require("express").Router();

router.get("/api/admin/users",findAllUsers)
router.get('/api/admin/listings',allListings)


module.exports = router;