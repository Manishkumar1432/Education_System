const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');

const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const filePath = req.file ? `/uploads/notes/${req.file.filename}` : undefined;
  const note = await Note.create({ title, content, filePath, teacher: req.user._id, tags: tags ? tags.split(',').map(t => t.trim()) : [] });
  res.status(201).json(note);
});

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().populate('teacher', 'name');
  res.json(notes);
});

const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate('teacher', 'name');
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json(note);
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  if (String(note.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Forbidden');
  }
  const { title, content, tags } = req.body;
  if (title) note.title = title;
  if (content) note.content = content;
  if (tags) note.tags = tags.split(',').map(t => t.trim());
  await note.save();
  res.json(note);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  if (String(note.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Forbidden');
  }
  await note.remove();
  res.json({ message: 'Note removed' });
});

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };