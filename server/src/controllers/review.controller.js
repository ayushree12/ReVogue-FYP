const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncHandler');

exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    buyerId: req.user.id,
    sellerId: req.body.sellerId,
    productId: req.body.productId,
    rating: req.body.rating,
    comment: req.body.comment
  });
  res.status(201).json({ review });
});

exports.getSellerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ sellerId: req.params.sellerId }).sort('-createdAt');
  res.json({ reviews });
});
