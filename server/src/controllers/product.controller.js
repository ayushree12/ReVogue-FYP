const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const getPagination = require('../utils/pagination');
const cloudinary = require('../config/cloudinary');

const CLOUD_FIELDS = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];

const requireCloudinary = () => {
  const missing = CLOUD_FIELDS.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing Cloudinary configuration: please set ${missing.join(', ')} in your environment.`
    );
  }
};

const processImages = async (files = []) => {
  if (!files.length) return [];
  requireCloudinary();
  const uploads = await Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'revogue' }, (error, result) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url, publicId: result.public_id });
          });
          stream.end(file.buffer);
        })
    )
  );
  return uploads;
};

exports.listProducts = asyncHandler(async (req, res) => {
  const {
    search,
    condition,
    location,
    categoryId,
    minPrice,
    maxPrice,
    size,
    status,
    sort
  } = req.query;
  const filters = {};
  if (search) {
    filters.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }
  if (condition) filters.condition = condition;
  if (categoryId) filters.categoryId = categoryId;
  if (size) filters.size = size;
  if (status) {
    filters.status = status;
  } else {
    filters.status = 'available';
  }
  if (location) {
    filters.$or = filters.$or || [];
    filters.$or.push({ 'location.city': new RegExp(location, 'i') }, { 'location.district': new RegExp(location, 'i') });
  }
  if (minPrice) filters.price = { ...filters.price, $gte: Number(minPrice) };
  if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };

  const { page, limit, skip } = getPagination(req.query);
  const sorter = {
    newest: { createdAt: -1 },
    price_low: { price: 1 },
    price_high: { price: -1 }
  };
  const sortBy = sorter[sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filters).sort(sortBy).skip(skip).limit(limit),
    Product.countDocuments(filters)
  ]);

  res.json({ products, meta: { total, page, limit } });
});

exports.listSellerProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filters = { sellerId: req.user.id };
  const [products, total] = await Promise.all([
    Product.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filters)
  ]);
  res.json({ products, meta: { total, page, limit } });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('sellerId', 'name sellerProfile');
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) {
    return res.status(400).json({ message: 'Product title is required' });
  }
  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const duplicate = await Product.findOne({
    sellerId: req.user.id,
    title: { $regex: `^${escapeRegex(title)}$`, $options: 'i' }
  });
  if (duplicate) {
    return res.status(409).json({ message: 'You already listed a product with this title' });
  }

  const images = await processImages(req.files || []);
  const payload = {
    ...req.body,
    title,
    sellerId: req.user.id,
    images
  };
  const product = await Product.create(payload);
  res.status(201).json({ product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  Object.assign(product, {
    ...req.body
  });
  if (req.files && req.files.length) {
    const images = await processImages(req.files);
    product.images = images;
  }
  await product.save();
  res.json({ product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

exports.reportProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  product.status = 'hidden';
  await product.save();
  res.json({ message: 'Product reported and hidden for review' });
});
