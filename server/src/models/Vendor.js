const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    storeName: { type: String },
    contactNumber: { type: String },
    inventoryPreview: { type: String },
    address: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    documents: [
      {
        name: { type: String },
        status: { type: String, default: 'pending' }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
