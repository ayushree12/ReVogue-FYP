const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

const ensureCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await ensureCart(req.user.id);
  await cart.populate('items.productId', 'title price images status');
  res.json({ cart });
});

exports.addCartItem = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || product.status !== 'available') {
    return res.status(404).json({ message: 'Product unavailable' });
  }
  const cart = await ensureCart(req.user.id);
  const existing = cart.items.find((item) => item.productId.equals(productId));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ productId, qty });
  }
  await cart.save();
  res.json({ cart });
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const cart = await ensureCart(req.user.id);
  const item = cart.items.find((item) => item.productId.equals(req.params.productId));
  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  item.qty = Math.max(1, qty);
  await cart.save();
  res.json({ cart });
});

exports.deleteCartItem = asyncHandler(async (req, res) => {
  const cart = await ensureCart(req.user.id);
  cart.items = cart.items.filter((item) => !item.productId.equals(req.params.productId));
  await cart.save();
  res.json({ cart });
});
