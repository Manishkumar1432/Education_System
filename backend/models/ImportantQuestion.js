const mongoose = require('mongoose');

const iqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  explanation: String,
  subject: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ImportantQuestion', iqSchema);