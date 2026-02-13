require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Video = require('../models/Video');
const Note = require('../models/Note');
const ImportantQuestion = require('../models/ImportantQuestion');
const Quiz = require('../models/Quiz');

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Video.deleteMany();
    await Note.deleteMany();
    await ImportantQuestion.deleteMany();
    await Quiz.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash('password123', salt);

    const teacher = await User.create({ name: 'Alice Teacher', email: 'teacher@example.com', password: passHash, role: 'teacher' });
    const student = await User.create({ name: 'Bob Student', email: 'student@example.com', password: passHash, role: 'student' });

    await Video.create({ title: 'Intro to Algebra', description: 'Basic algebra lecture', filePath: '/uploads/videos/sample.mp4', teacher: teacher._id });
    await Note.create({ title: 'Lecture 1 Notes', content: 'These are notes', teacher: teacher._id });
    await ImportantQuestion.create({ question: 'What is 2+2?', explanation: 'Sum of two numbers', subject: 'Math', teacher: teacher._id });

    await Quiz.create({ title: 'Algebra Warmup', description: 'Short quiz', teacher: teacher._id, questions: [ { text: '2+2?', options: ['1','2','3','4'], correctAnswer: 3 } ] });

    console.log('Seed complete. Teacher: teacher@example.com / password123, Student: student@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();