const router = require("express").Router();
const { addListing, listings, editListing} = require("../controller/hostController");
const multer = require('../middleware/multer')
const userAuth = require('../middleware/userAuth')

router.post("/api/host/addlisting",multer.array("image",20),userAuth,addListing)
router.patch("/api/host/editListing",multer.array("image",20),editListing)
router.get("/api/host/listings",userAuth,listings)

module.exports= router;