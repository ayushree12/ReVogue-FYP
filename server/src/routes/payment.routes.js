const router = require('express').Router();
const {
  khaltiInitiate,
  khaltiVerify,
  esewaInitiate,
  esewaVerify
} = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

router.post('/khalti/initiate', protect, khaltiInitiate);
router.post('/khalti/verify', protect, khaltiVerify);
router.post('/esewa/initiate', protect, esewaInitiate);
router.post('/esewa/verify', protect, esewaVerify);

module.exports = router;
