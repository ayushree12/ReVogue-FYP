const router = require('express').Router();
const { createReview, getSellerReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/seller/:sellerId', getSellerReviews);

module.exports = router;
