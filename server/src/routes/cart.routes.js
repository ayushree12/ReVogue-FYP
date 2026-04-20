const router = require('express').Router();
const {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCart);
router.post('/items', protect, addCartItem);
router.patch('/items/:productId', protect, updateCartItem);
router.delete('/items/:productId', protect, deleteCartItem);

module.exports = router;
