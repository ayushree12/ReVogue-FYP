const User = require('../models/User');
const VerificationRequest = require('../models/VerificationRequest');
const Vendor = require('../models/Vendor');
const asyncHandler = require('../middleware/asyncHandler');

const sanitizeSeller = (user) => ({
  id: user._id,
  name: user.name,
  role: user.role,
  sellerProfile: user.sellerProfile,
  avatar: user.avatar,
  createdAt: user.createdAt
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  ['name', 'avatar'].forEach((field) => {
    if (req.body[field]) user[field] = req.body[field];
  });
  if (req.body.sellerProfile) {
    user.sellerProfile = {
      ...user.sellerProfile,
      ...req.body.sellerProfile
    };
  }
  await user.save();
  res.json({ user: sanitizeSeller(user) });
});

exports.getSellerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ message: 'Seller not found' });
  }
  res.json({ user: sanitizeSeller(user) });
});

exports.promoteUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    return res.status(404).json({ message: 'User not found' });
  }
  const secret = req.body.secret;
  const validSecret = process.env.ADMIN_PROMOTE_SECRET;
  if (req.user.role !== 'admin' && (!validSecret || secret !== validSecret)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  target.role = 'admin';
  await target.save();
  res.json({ message: 'User promoted to admin' });
});

exports.becomeSeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.role = 'seller';
  user.sellerProfile = {
    ...user.sellerProfile,
    ...(req.body.sellerProfile || {})
  };
  await user.save();
  res.json({ message: 'Seller profile enabled', user: sanitizeSeller(user) });
});

exports.createVerificationRequest = asyncHandler(async (req, res) => {
  const existing = await VerificationRequest.findOne({ sellerId: req.user.id, status: 'pending' });
  if (existing) {
    return res.status(400).json({ message: 'You already have a pending request' });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const profileUpdates = {
    storeName: user.sellerProfile?.storeName || user.name,
    phone: req.body.contactNumber || user.sellerProfile?.phone,
    address: req.body.address || user.sellerProfile?.address,
    verificationStatus: 'pending',
    isVerified: false
  };
  user.sellerProfile = {
    ...user.sellerProfile,
    ...profileUpdates
  };
  user.role = 'seller';
  await user.save();

  const vendor = await Vendor.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      storeName: profileUpdates.storeName,
      contactNumber: profileUpdates.phone,
      address: profileUpdates.address,
    status: 'pending',
    documents: [{ name: 'Identity proof', status: 'pending' }]
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const request = await VerificationRequest.create({
    sellerId: req.user.id,
    vendorId: vendor._id,
    documents: [{ name: 'Identity proof', status: 'pending' }],
    message: req.body.story || req.body.message || '',
    storeName: profileUpdates.storeName,
    contactNumber: profileUpdates.phone,
    address: profileUpdates.address
  });
  res.status(201).json({ request });
});
