const router = require('express').Router();
const {
  listProducts,
  listSellerProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  reportProduct
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');
const upload = require('../middleware/upload');

router.get('/', listProducts);
router.get('/seller/me', protect, authorizeRoles('seller', 'admin'), listSellerProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorizeRoles('seller', 'admin'), upload.array('images', 6), createProduct);
router.patch('/:id', protect, authorizeRoles('seller', 'admin'), upload.array('images', 6), updateProduct);
router.delete('/:id', protect, authorizeRoles('seller', 'admin'), deleteProduct);
router.post('/:id/report', protect, reportProduct);

module.exports = router;
