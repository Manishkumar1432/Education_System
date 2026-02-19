const asyncHandler = require('express-async-handler');
const ImportantQuestion = require('../models/ImportantQuestion');


// CREATE QUESTION (Teacher Only)
const createQuestion = asyncHandler(async (req, res) => {
  const { question, explanation, subject } = req.body;

  const q = await ImportantQuestion.create({
    question,
    explanation,
    subject,
    teacher: req.user._id
  });

  res.status(201).json(q);
});


// LIST ALL QUESTIONS
const listQuestions = asyncHandler(async (req, res) => {
  const qs = await ImportantQuestion.find()
    .populate('teacher', 'name');

  res.json(qs);
});


// GET SINGLE QUESTION
const getQuestion = asyncHandler(async (req, res) => {
  const q = await ImportantQuestion.findById(req.params.id)
    .populate('teacher', 'name');

  if (!q) {
    res.status(404);
    throw new Error('Question not found');
  }

  res.json(q);
});


// UPDATE QUESTION (Only Owner Teacher)
const updateQuestion = asyncHandler(async (req, res) => {
  const q = await ImportantQuestion.findById(req.params.id);

  if (!q) {
    res.status(404);
    throw new Error('Question not found');
  }

  // Check ownership
  if (String(q.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can update only your own question');
  }

  const { question, explanation, subject } = req.body;

  if (question) q.question = question;
  if (explanation) q.explanation = explanation;
  if (subject) q.subject = subject;

  await q.save();

  res.json(q);
});


// DELETE QUESTION (Only Owner Teacher)
const deleteQuestion = asyncHandler(async (req, res) => {
  const q = await ImportantQuestion.findById(req.params.id);

  if (!q) {
    res.status(404);
    throw new Error('Question not found');
  }

  // Ownership check
  if (String(q.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can delete only your own question');
  }

  await ImportantQuestion.findByIdAndDelete(req.params.id);

  res.json({ message: 'Question deleted successfully' });
});

module.exports = {
  createQuestion,
  listQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
};
