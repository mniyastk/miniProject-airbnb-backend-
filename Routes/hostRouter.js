const router = require("express").Router();
const { addListing, listings} = require("../controller/hostController");
const multer = require('../middleware/multer')
const userAuth = require('../middleware/userAuth')

router.post("/api/host/addlisting",multer.array("image",20),userAuth,addListing)
router.get("/api/host/listings",userAuth,listings)

module.exports= router;