const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { submitQuiz, listResultsForStudent, listResultsForTeacher } = require('../controllers/resultController');

router.post('/:id/submit', protect, authorizeRoles('student'), submitQuiz);
router.get('/me', protect, authorizeRoles('student'), listResultsForStudent);
router.get('/teacher', protect, authorizeRoles('teacher'), listResultsForTeacher);

module.exports = router;