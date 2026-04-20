const router = require('express').Router();
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const { protect } = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

router.get('/', listCategories);
router.post('/', protect, authorizeRoles('admin'), createCategory);
router.patch('/:id', protect, authorizeRoles('admin'), updateCategory);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;
