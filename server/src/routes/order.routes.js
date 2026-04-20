const router = require('express').Router();
const {
  checkout,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

router.post('/checkout', protect, checkout);
router.get('/me', protect, getUserOrders);
router.get('/seller', protect, authorizeRoles('seller', 'admin'), getSellerOrders);
router.patch('/:id/status', protect, authorizeRoles('seller', 'admin'), updateOrderStatus);

module.exports = router;
