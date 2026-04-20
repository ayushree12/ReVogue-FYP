const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const user = await User.findById(decoded.id).select('-passwordHash');

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  req.user = user;
  next();
});
