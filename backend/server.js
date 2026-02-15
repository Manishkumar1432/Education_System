require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const noteRoutes = require('./routes/notes');
const questionRoutes = require('./routes/questions');
const quizRoutes = require('./routes/quizzes');
const resultRoutes = require('./routes/results');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Static uploads

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'API running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error('❌ DB connection failed:', err));
