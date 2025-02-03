const express = require("express")
const router = express.Router()
const multer = require("multer");
const path = require("path")
const { uploads } = require("../controllers/imageControl");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const upload = multer({ storage: storage });

router.use('/uploads', express.static(path.join( 'uploads')));

router.post('/images/uploads', upload.single('image'), uploads);

module.exports = router