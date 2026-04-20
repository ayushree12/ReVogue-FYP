const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const sellerProfileSchema = new Schema(
  {
    storeName: { type: String, trim: true },
    bio: { type: String },
    phone: { type: String },
    address: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    sellerProfile: sellerProfileSchema,
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
