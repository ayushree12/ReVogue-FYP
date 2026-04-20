const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const VerificationRequest = require('../models/VerificationRequest');
const Vendor = require('../models/Vendor');
const asyncHandler = require('../middleware/asyncHandler');

exports.getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const sellers = await User.countDocuments({ role: 'seller' });
  const products = await Product.countDocuments();
  const orders = await Order.countDocuments();
  res.json({ totalUsers, sellers, products, orders });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json({ users });
});

exports.listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'pending' })
    .sort('-createdAt')
    .populate('sellerId', 'name');
  res.json({ products });
});

exports.approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  product.status = 'available';
  await product.save();
  res.json({ product });
});

exports.listReports = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'hidden' });
  res.json({ reports: products });
});

exports.downloadSalesReport = asyncHandler(async (req, res) => {
  const period = ['daily', 'monthly', 'yearly'].includes(req.query.period) ? req.query.period : 'daily';
  const dateFormats = {
    daily: '%Y-%m-%d',
    monthly: '%Y-%m',
    yearly: '%Y'
  };
  const timezone = 'Asia/Kathmandu';
  const groupId = {
    $dateToString: {
      format: dateFormats[period],
      date: '$createdAt',
      timezone
    }
  };

  const pipeline = [
    {
      $match: {
        status: { $in: ['paid', 'shipped', 'delivered'] }
      }
    },
    {
      $group: {
        _id: {
          period: groupId,
          vendor: '$sellerId'
        },
        totalSales: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id.vendor',
        foreignField: '_id',
        as: 'vendor'
      }
    },
    {
      $unwind: {
        path: '$vendor',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        period: '$_id.period',
        orderCount: 1,
        totalSales: 1,
        vendorName: { $ifNull: ['$vendor.name', 'Unknown vendor'] }
      }
    },
    {
      $sort: { period: 1, vendorName: 1 }
    }
  ];

  const results = await Order.aggregate(pipeline);

  const header = 'Period,Vendor,Order count,Sales (Rs)\n';
  const body = results
    .map((row) => {
      const sales = (row.totalSales || 0).toFixed(2);
      return `${row.period},${row.vendorName},${row.orderCount},${sales}`;
    })
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="sales-${period}.csv"`);
  res.send(`${header}${body}`);
});

exports.getRecentOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort('-createdAt').limit(6).populate('userId', 'name').populate('sellerId', 'name');
  res.json({ orders });
});

exports.listVerificationRequests = asyncHandler(async (req, res) => {
  const requests = await VerificationRequest.find()
    .populate('sellerId', 'name email')
    .populate('vendorId');
  res.json({ requests });
});

exports.reviewVerification = asyncHandler(async (req, res) => {
  const request = await VerificationRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }
  request.status = req.body.status;
  request.adminNote = req.body.adminNote || '';
  await request.save();
  const vendor = request.vendorId
    ? await Vendor.findById(request.vendorId)
    : await Vendor.findOne({ userId: request.sellerId });
  if (vendor) {
    vendor.status = req.body.status;
    await vendor.save();
  }
  const seller = await User.findById(request.sellerId);
  if (seller) {
    if (req.body.status === 'approved') {
      seller.role = 'seller';
      seller.sellerProfile = {
        ...seller.sellerProfile,
        isVerified: true,
        verificationStatus: 'approved'
      };
    }
    if (req.body.status === 'rejected') {
      seller.role = 'user';
      seller.sellerProfile = {
        ...seller.sellerProfile,
        verificationStatus: 'rejected'
      };
    }
    await seller.save();
  }
  res.json({ request });
});
