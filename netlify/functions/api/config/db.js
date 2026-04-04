const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing in environment variables');
    return null;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    console.log('MongoDB connected');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;
