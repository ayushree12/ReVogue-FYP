const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
