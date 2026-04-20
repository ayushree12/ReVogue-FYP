const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

exports.listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json({ categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, parent } = req.body;
  const slug = slugify(name);
  const category = await Category.create({ name, slug, parent: parent || null });
  res.status(201).json({ category });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  if (req.body.name) {
    category.name = req.body.name;
    category.slug = slugify(req.body.name);
  }
  if (req.body.parent !== undefined) {
    category.parent = req.body.parent || null;
  }
  await category.save();
  res.json({ category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json({ message: 'Category removed' });
});
