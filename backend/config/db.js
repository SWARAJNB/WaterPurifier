const mongoose = require('mongoose');

const connectDB = async (retrySeconds = 5) => {
  let connected = false;
  while (!connected) {
    try {
      console.log('⏳ Connecting to MongoDB...');
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      connected = true;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.log(`🔄 Retrying in ${retrySeconds} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retrySeconds * 1000));
    }
  }
};

module.exports = connectDB;
