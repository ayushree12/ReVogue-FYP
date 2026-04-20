const router = require('express').Router();
const {
  getStats,
  listUsers,
  listProducts,
  listReports,
  getRecentOrders,
  listVerificationRequests,
  reviewVerification,
  downloadSalesReport,
  approveProduct
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

router.get('/stats', protect, authorizeRoles('admin'), getStats);
router.get('/users', protect, authorizeRoles('admin'), listUsers);
router.get('/products', protect, authorizeRoles('admin'), listProducts);
router.get('/reports', protect, authorizeRoles('admin'), listReports);
router.get('/reports/sales', protect, authorizeRoles('admin'), downloadSalesReport);
router.patch('/products/:id/approve', protect, authorizeRoles('admin'), approveProduct);
router.get('/orders/recent', protect, authorizeRoles('admin'), getRecentOrders);
router.get('/verification-requests', protect, authorizeRoles('admin'), listVerificationRequests);
router.patch('/verification-requests/:id', protect, authorizeRoles('admin'), reviewVerification);

module.exports = router;
