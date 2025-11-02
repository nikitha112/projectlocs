const express = require('express');
const router = express.Router();
const { getItems, createItem } = require('../controllers/itemController');
const multer = require('multer');
const path = require('path');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get('/', getItems);
router.post('/', upload.single('imageFile'), createItem);

module.exports = router;
