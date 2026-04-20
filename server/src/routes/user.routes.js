const router = require('express').Router();
const {
  updateProfile,
  getSellerProfile,
  promoteUser,
  becomeSeller,
  createVerificationRequest
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

router.patch('/me', protect, updateProfile);
router.get('/:id', getSellerProfile);
router.post('/:id/promote-admin', protect, promoteUser);
router.post('/become-seller', protect, becomeSeller);
router.post('/seller/verification-request', protect, createVerificationRequest);

module.exports = router;
