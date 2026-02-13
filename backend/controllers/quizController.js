const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');

const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, questions, durationMinutes } = req.body;
  const parsed = Array.isArray(questions) ? questions : JSON.parse(questions || '[]');
  const quiz = await Quiz.create({ title, description, questions: parsed, teacher: req.user._id, durationMinutes });
  res.status(201).json(quiz);
});

const listQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find().populate('teacher', 'name');
  res.json(quizzes);
});

const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) { res.status(404); throw new Error('Not found'); }
  res.json(quiz);
});

const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) { res.status(404); throw new Error('Not found'); }
  if (String(quiz.teacher) !== String(req.user._id)) { res.status(403); throw new Error('Forbidden'); }
  const { title, description, questions, durationMinutes } = req.body;
  if (title) quiz.title = title;
  if (description) quiz.description = description;
  if (questions) quiz.questions = Array.isArray(questions) ? questions : JSON.parse(questions);
  if (durationMinutes) quiz.durationMinutes = durationMinutes;
  await quiz.save();
  res.json(quiz);
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) { res.status(404); throw new Error('Not found'); }
  if (String(quiz.teacher) !== String(req.user._id)) { res.status(403); throw new Error('Forbidden'); }
  await quiz.remove();
  res.json({ message: 'Deleted' });
});

module.exports = { createQuiz, listQuizzes, getQuiz, updateQuiz, deleteQuiz };