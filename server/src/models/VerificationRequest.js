const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    documents: [
      {
        name: { type: String },
        status: { type: String, default: 'pending' }
      }
    ],
    message: { type: String },
    storeName: { type: String },
    contactNumber: { type: String },
    inventoryPreview: { type: String },
    address: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    adminNote: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('VerificationRequest', verificationSchema);
