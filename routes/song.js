const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createSong, searchSongs } = require("../controllers/songcontrol");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  })
const upload = multer({ storage: storage });
router.get('/create', (req, res) => {
    res.render('createSong');
});

router.post('/create', upload.fields([{ name: 'audioFile', maxCount: 1 }, { name: 'thumbnailFile', maxCount: 1 }]), createSong);

router.get('/search', searchSongs);

module.exports = router;