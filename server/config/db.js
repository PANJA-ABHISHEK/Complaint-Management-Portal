import mongoose from 'mongoose';
import config from './env.js';
import dns from 'dns';

// Force use of Google DNS to resolve MongoDB Atlas SRV records
dns.setDefaultResultOrder('ipv4first');
// If your ISP/network blocks Atlas DNS, uncomment below:
// dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error('');
    console.error('   Possible fixes:');
    console.error('   1. Check your IP is whitelisted in Atlas → Network Access');
    console.error('   2. Add 0.0.0.0/0 to Atlas whitelist for development');
    console.error('   3. Check your internet connection');
    console.error('   4. Verify the connection string in server/.env');
    console.error('');
    process.exit(1);
  }
};

export default connectDB;
