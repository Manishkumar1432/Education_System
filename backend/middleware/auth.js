const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');


// 🔐 Protect Middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // No token
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    next();

  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});


// 🎭 Role Authorization Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Forbidden: insufficient role');
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };
