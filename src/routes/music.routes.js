const express = require("express");

const musicController = require("../controllers/music.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

const multer = require("multer"); //middle ware used to handle file uploads
// req.body.file → won't work

const upload = multer({
  storage: multer.memoryStorage()
})

/*ile is stored in RAM (buffer) instead of disk
No file is saved locally
Useful for:
Cloud uploads (Cloudinary, S3)
Faster processing
*/

//Create music
router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic);
//upload.single("music") -> basically tells multer to expect a single file from the field name "music" in the form data. It will process that file and make it available in req.file for the controller to use.

//Create Album
router.post("/album", authMiddleware.authArtist,  musicController.createAlbum);


router.get("/", musicController.getAllMusics);


module.exports = router;