const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body; // [{ questionId, answerIndex }]
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) { res.status(404); throw new Error('Quiz not found'); }
  let score = 0;
  for (const a of answers) {
    const question = quiz.questions.id(a.questionId);
    if (question && question.correctAnswer === a.answerIndex) score++;
  }
  const percentage = (score / quiz.questions.length) * 100;
  const result = await QuizResult.create({ quiz: quiz._id, student: req.user._id, answers, score: percentage });
  res.status(201).json(result);
});

const listResultsForStudent = asyncHandler(async (req, res) => {
  const results = await QuizResult.find({ student: req.user._id }).populate('quiz', 'title');
  res.json(results);
});

const listResultsForTeacher = asyncHandler(async (req, res) => {
  // teacher sees results for quizzes they authored
  const quizzes = await Quiz.find({ teacher: req.user._id }).select('_id');
  const quizIds = quizzes.map(q => q._id);
  const results = await QuizResult.find({ quiz: { $in: quizIds } }).populate('student', 'name email').populate('quiz', 'title');
  res.json(results);
});

module.exports = { submitQuiz, listResultsForStudent, listResultsForTeacher };