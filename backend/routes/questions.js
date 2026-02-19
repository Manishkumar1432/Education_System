const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');

const {
  createQuestion,
  listQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');


// Public routes
router.get('/', listQuestions);
router.get('/:id', getQuestion);

// Teacher only routes
router.post('/', protect, authorizeRoles('teacher'), createQuestion);
router.put('/:id', protect, authorizeRoles('teacher'), updateQuestion);
router.delete('/:id', protect, authorizeRoles('teacher'), deleteQuestion);

module.exports = router;
