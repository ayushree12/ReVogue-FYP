const jwt = require('jsonwebtoken');

const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

module.exports = {
  signAccessToken
};
