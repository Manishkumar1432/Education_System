const mongoose = require('mongoose');

const importantQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    explanation: String,
    subject: String,
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImportantQuestion', importantQuestionSchema);
