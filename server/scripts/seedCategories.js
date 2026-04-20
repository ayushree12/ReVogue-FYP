const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../src/models/Category');
const connectDB = require('../src/config/db');

dotenv.config();

const categories = [
  { name: 'Menswear', slug: 'menswear' },
  { name: 'Womenswear', slug: 'womenswear' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Footwear', slug: 'footwear' }
];

const seed = async () => {
  await connectDB();
  await Category.deleteMany();
  await Category.insertMany(categories);
  console.log('Categories seeded');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
