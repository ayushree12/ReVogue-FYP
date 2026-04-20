const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

exports.checkout = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  if (!cart || !cart.items.length) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  const items = cart.items
    .filter((item) => item.productId?.status !== 'hidden')
    .map((item) => ({
      productId: item.productId._id,
      qty: item.qty,
      priceSnapshot: item.productId.price
    }));
  if (!items.length) {
    return res.status(400).json({ message: 'No available items in cart' });
  }
  const totalAmount = items.reduce((sum, item) => sum + item.qty * item.priceSnapshot, 0);
  const sellerId = cart.items[0]?.productId?.sellerId || null;
  const paymentPayload = req.body.payment || {};
  const shippingAddress = req.body.shippingAddress || {};
  const paymentProvider = paymentPayload.provider || 'cod';
  const isPaidPayment = ['paid', 'success'].includes(
    (paymentPayload.paymentStatus || '').toString().toLowerCase()
  ) || paymentPayload.verified === true;
  const paymentStatus = paymentProvider === 'cod' ? 'pending' : isPaidPayment ? 'paid' : 'pending';
  const transactionId = paymentPayload.transactionId || paymentPayload.idx || `order-${Date.now()}`;
  const order = await Order.create({
    userId: req.user.id,
    sellerId,
    items,
    totalAmount,
    payment: {
      provider: paymentProvider,
      transactionId,
      paymentStatus
    },
    shippingAddress,
    status: paymentStatus === 'paid' ? 'paid' : 'pending'
  });

  const uniqueProductIds = [
    ...new Set(items.map((item) => item.productId.toString()))
  ].map((id) => id);
  await Product.updateMany(
    { _id: { $in: uniqueProductIds } },
    { status: 'sold' },
    { strict: false }
  );
  cart.items = [];
  await cart.save();
  res.status(201).json({ order });
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
  res.json({ orders });
});

exports.getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ sellerId: req.user.id })
    .sort('-createdAt')
    .populate('userId', 'name email')
    .populate('items.productId', 'title images');
  res.json({ orders });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (req.user.role !== 'admin' && order.sellerId?.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  order.status = req.body.status;
  await order.save();
  res.json({ order });
});
