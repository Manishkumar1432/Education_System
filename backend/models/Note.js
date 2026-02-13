const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  filePath: String, // optional upload
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);