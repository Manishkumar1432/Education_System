const asyncHandler = require('express-async-handler');
const ImportantQuestion = require('../models/ImportantQuestion');

const createQuestion = asyncHandler(async (req, res) => {
  const { question, explanation, subject } = req.body;
  const q = await ImportantQuestion.create({ question, explanation, subject, teacher: req.user._id });
  res.status(201).json(q);
});

const listQuestions = asyncHandler(async (req, res) => {
  const qs = await ImportantQuestion.find().populate('teacher', 'name');
  res.json(qs);
});

const getQuestion = asyncHandler(async (req, res) => {
  const q = await ImportantQuestion.findById(req.params.id);
  if (!q) { res.status(404); throw new Error('Not found'); }
  res.json(q);
});

const updateQuestion = asyncHandler(async (req, res) => {
  const q = await ImportantQuestion.findById(req.params.id);
  if (!q) { res.status(404); throw new Error('Not found'); }
  if (String(q.teacher) !== String(req.user._id)) { res.status(403); throw new Error('Forbidden'); }
  const { question, explanation, subject } = req.body;
  if (question) q.question = question;
  if (explanation) q.explanation = explanation;
  if (subject) q.subject = subject;
  await q.save();
  res.json(q);
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const q = await ImportantQuestion.findById(req.params.id);
  if (!q) { res.status(404); throw new Error('Not found'); }
  if (String(q.teacher) !== String(req.user._id)) { res.status(403); throw new Error('Forbidden'); }
  await q.remove();
  res.json({ message: 'Deleted' });
});

module.exports = { createQuestion, listQuestions, getQuestion, updateQuestion, deleteQuestion };