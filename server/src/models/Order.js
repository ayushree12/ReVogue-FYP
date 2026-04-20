const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: { type: Number, min: 1, required: true },
    priceSnapshot: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    payment: {
      provider: { type: String },
      transactionId: { type: String },
      paymentStatus: { type: String, default: 'pending' }
    },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      district: { type: String },
      postalCode: { type: String },
      country: { type: String, default: 'Nepal' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
