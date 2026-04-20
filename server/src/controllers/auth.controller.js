const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { signAccessToken } = require('../utils/token');
const asyncHandler = require('../middleware/asyncHandler');

const sanitizeUser = (user, vendor = null) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  sellerProfile: user.sellerProfile,
  avatar: user.avatar,
  verified: user.sellerProfile?.verificationStatus === 'approved',
  vendorId: vendor?._id || null,
  vendorStatus: vendor?.status || user.sellerProfile?.verificationStatus || 'pending'
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' });
  }
  const user = await User.create({
    name,
    email,
    passwordHash: password
  });
  const token = signAccessToken({ id: user._id, role: user.role });
  res.status(201).json({ user: sanitizeUser(user), token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const vendor = await Vendor.findOne({ userId: user._id });

  const normalizedRole =
    role === 'vendor'
      ? 'seller'
      : role === 'seller'
        ? 'seller'
        : role === 'admin'
          ? 'admin'
          : null;

  if (normalizedRole === 'admin' && user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access is restricted' });
  }

  if (normalizedRole === 'seller') {
    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Vendor access is pending admin approval' });
    }
    if (!vendor || vendor.status !== 'approved') {
      return res.status(403).json({ message: 'Vendor verification still pending' });
    }
  }

  if (user.role === 'seller' && (!vendor || vendor.status !== 'approved')) {
    return res.status(403).json({ message: 'Seller account awaiting admin approval' });
  }

  const token = signAccessToken({ id: user._id, role: user.role });
  res.json({ user: sanitizeUser(user, vendor), token });
});

exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'If that email exists, we sent a recovery link' });
  }
  const resetToken = bcrypt.hashSync(user._id.toString(), 6);
  res.json({ message: 'Reset token generated (send via email in production)', token: resetToken });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.passwordHash = password;
  await user.save();
  res.json({ message: 'Password updated' });
});

exports.me = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  res.json({ user: sanitizeUser(req.user, vendor) });
});
