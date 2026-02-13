const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { createQuiz, listQuizzes, getQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');

router.get('/', listQuizzes);
router.get('/:id', getQuiz);
router.post('/', protect, authorizeRoles('teacher'), createQuiz);
router.put('/:id', protect, authorizeRoles('teacher'), updateQuiz);
router.delete('/:id', protect, authorizeRoles('teacher'), deleteQuiz);

module.exports = router;