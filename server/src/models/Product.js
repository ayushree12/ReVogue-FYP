const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [imageSchema],
    price: { type: Number, required: true, min: 0 },
    condition: {
      type: String,
      enum: ['new', 'like_new', 'good', 'fair'],
      default: 'good'
    },
    size: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    location: {
      city: { type: String },
      district: { type: String }
    },
    tags: [String],
    status: {
      type: String,
      enum: ['pending', 'available', 'sold', 'hidden'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
