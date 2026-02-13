const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  filePath: { type: String, required: true }, // local path /uploads/videos/...
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: Number,
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);