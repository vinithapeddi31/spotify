const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const Song = require("../models/Song");
const User = require("../models/User");
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

const {uploadFileToS3} =require('../services/uploadToS3')

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

router.post('/create', upload.fields([{ name: 'audioFile', maxCount: 1 }, { name: 'thumbnailFile', maxCount: 1 }]), async (req, res) => {
    try {
        const audioFile = req.files.audioFile ? `./public/uploads/${req.files.audioFile[0].filename}` : '';
        const thumbnailFile = req.files.thumbnailFile ? req.files.thumbnailFile[0] : null;

        const audioUrl = await uploadFileToS3('songaudio', req.files.audioFile[0]);

        let thumbnailUrl = null;

        if (thumbnailFile) {
            thumbnailUrl = await uploadFileToS3('songaudio', thumbnailFile);
        }

        const newSong = new Song({
            name: req.body.name,
            artist: req.body.artist,
            audioUrl: audioUrl,
            thumbnailUrl: thumbnailUrl,
        });

        await newSong.save();

        res.status(201).send('File uploaded successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/search', async (req, res) => {
    const { query } = req.query;
  
    try {
      const results = await Song.find({ $text: { $search: query } });
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;



