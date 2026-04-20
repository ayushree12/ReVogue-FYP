const Order = require('../models/Order');
const Product = require('../models/Product');
const Conversation = require('../models/Conversation');
const asyncHandler = require('../middleware/asyncHandler');

exports.getSellerAnalytics = asyncHandler(async (req, res) => {
  const [orders, products, conversations] = await Promise.all([
    Order.find({ sellerId: req.user.id }),
    Product.find({ sellerId: req.user.id }).sort('-createdAt'),
    Conversation.countDocuments({ sellerId: req.user.id })
  ]);

  const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const paidOrders = orders.filter((order) => (order.payment?.paymentStatus || '').toLowerCase() === 'paid');
  const conversion = orders.length ? Math.round((paidOrders.length / orders.length) * 100 * 10) / 10 : 0;
  const avgOrder = paidOrders.length ? Math.round(revenue / paidOrders.length) : 0;
  const openChats = conversations;

  const metrics = [
    {
      label: 'Conversion',
      value: `${conversion}%`,
      helper: 'This week'
    },
    {
      label: 'Average order',
      value: `Rs ${avgOrder.toLocaleString()}`,
      helper: 'Per paid checkout'
    },
    {
      label: 'Top collection',
      value: products[0]?.title || '—',
      helper: 'Strong momentum'
    }
  ];

  const trendPoints = [
    { label: 'Orders', value: orders.length },
    { label: 'Revenue', value: `Rs ${revenue.toLocaleString()}` },
    { label: 'Chats', value: `${openChats}` },
    { label: 'Products', value: products.length }
  ];

  const alerts = [];
  if (products.length && products.filter((product) => product.status === 'available').length < 3) {
    alerts.push('Stock low for 3 listings');
  }
  if (!orders.length) {
    alerts.push('Still waiting on your first sale—launch a drop to get the wheel turning.');
  }
  if (!alerts.length) {
    alerts.push('Chat response within 3 min');
  }

  res.json({ metrics, trendPoints, alerts });
});
