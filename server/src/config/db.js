const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/revogue';

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }
};

module.exports = connectDB;
