const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

// ✅ Multer setup for in-memory upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', protect, authorizeRoles('teacher'), upload.single('file'), createNote);
router.put('/:id', protect, authorizeRoles('teacher'), updateNote);
router.delete('/:id', protect, authorizeRoles('teacher'), deleteNote);

module.exports = router;
