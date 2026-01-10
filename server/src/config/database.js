import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Cache the database connection for serverless environments
let cachedConnection = null;

const connectDB = async () => {
  // If we have a cached connection and it's ready, return it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    // Set mongoose options for serverless
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    cachedConnection = null;
    throw error; // Throw instead of process.exit for serverless
  }
};

export default connectDB;
