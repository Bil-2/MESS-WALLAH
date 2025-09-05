const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Add connection retry logic
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Make sure MongoDB is running on your system');
    console.log('Run: brew services start mongodb/brew/mongodb-community');
    process.exit(1);
  }
};

module.exports = connectDB;
