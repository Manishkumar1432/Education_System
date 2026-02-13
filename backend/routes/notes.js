const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorizeRoles } = require('../middleware/auth');
const { createNote, getNotes, getNote, updateNote, deleteNote } = require('../controllers/noteController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/notes');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, unique);
  }
});
const upload = multer({ storage });

router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', protect, authorizeRoles('teacher'), upload.single('file'), createNote);
router.put('/:id', protect, authorizeRoles('teacher'), updateNote);
router.delete('/:id', protect, authorizeRoles('teacher'), deleteNote);

module.exports = router;