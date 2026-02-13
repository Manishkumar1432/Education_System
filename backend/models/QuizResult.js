const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ questionId: mongoose.Schema.Types.ObjectId, answerIndex: Number }],
  score: Number
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', resultSchema);