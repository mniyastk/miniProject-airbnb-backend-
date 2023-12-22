const router = require("express").Router();
const { addListing, test, imageUplaod } = require("../controller/hostController");
const multer = require('../middleware/multer')


router.post("/api/host/addlisting",multer.array("image",15),addListing)

module.exports= router;