const router = require('express').Router();
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  me
} = require('../controllers/auth.controller');
const { createValidator, registerSchema, loginSchema } = require('../utils/validation');
const { protect } = require('../middleware/auth');

router.post('/register', createValidator(registerSchema), register);
router.post('/login', createValidator(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, me);

module.exports = router;
