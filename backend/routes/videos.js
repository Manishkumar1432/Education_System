const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorizeRoles } = require('../middleware/auth');
const { uploadVideo, listVideos, getVideo, updateVideo, deleteVideo } = require('../controllers/videoController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, unique);
  }
});
const upload = multer({ storage });

router.get('/', listVideos);
router.get('/:id', getVideo);
router.post('/', protect, authorizeRoles('teacher'), upload.single('video'), uploadVideo);
router.put('/:id', protect, authorizeRoles('teacher'), updateVideo);
router.delete('/:id', protect, authorizeRoles('teacher'), deleteVideo);

module.exports = router;