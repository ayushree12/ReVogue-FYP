const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
