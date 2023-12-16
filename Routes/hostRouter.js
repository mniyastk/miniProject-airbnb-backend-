const router = require("express").Router();
const { addListing, test, imageUplaod } = require("../controller/hostController");
const multer = require('../middleware/multer')


router.post("/api/host/addlisting",multer.array("image",15),addListing)
router.get("/api/test",test)
router.post("/api/imageUpload",multer.array("image",15),imageUplaod)

module.exports= router;