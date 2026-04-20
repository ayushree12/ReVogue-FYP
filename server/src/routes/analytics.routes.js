const router = require('express').Router();
const { getSellerAnalytics } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

router.get('/seller', protect, authorizeRoles('seller', 'admin'), getSellerAnalytics);

module.exports = router;
